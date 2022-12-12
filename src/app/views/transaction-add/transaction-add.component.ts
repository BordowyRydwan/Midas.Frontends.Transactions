import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  CurrencyDto,
  TransactionApiService,
  TransactionCategoryDto, TransactionDto
} from "../../services/transaction/transaction.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TransactionDtoConverter } from "../../helpers/model-converters/transaction-dto";
import { Observable, tap, zip, map } from "rxjs";
import ComponentState from "../../../enums/component-state";

@Component({
  selector: 'app-transaction-add',
  templateUrl: './transaction-add.component.html',
  styleUrls: ['./transaction-add.component.css']
})
export class TransactionAddComponent implements OnInit {
  state = ComponentState.LOADING
  states = ComponentState;

  requestLoading = false;
  authError = '';
  categories: TransactionCategoryDto[] = [];
  filteredCategories: TransactionCategoryDto[] = [];
  currencies: CurrencyDto[] = [];
  userId: number = 0;
  isExpense = true;

  addTransactionForm = new FormGroup({
    title: new FormControl<string | null>(null, [
      Validators.required, Validators.minLength(10), Validators.maxLength(50)  ]
    ),
    description: new FormControl<string | null>(null, [
      Validators.required, Validators.minLength(10), Validators.maxLength(200)
    ]),
    recipientName: new FormControl<string | null>(null, [
      Validators.required, Validators.minLength(10), Validators.maxLength(100)
    ]),
    amount: new FormControl<number | null>(null, [ Validators.required ]),
    currency: new FormControl<CurrencyDto | null>(null, [ Validators.required ]),
    category: new FormControl<TransactionCategoryDto | null>(null, [ Validators.required ]),
  });

  constructor(
    private transactionApi: TransactionApiService,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
    const num = route.snapshot.paramMap.get('userid')!

    if (Number.isNaN(num)) {
      router.navigate(['transactions']);
    }

    this.userId = Number.parseInt(num);
  }

  ngOnInit(): void {
    const calls = zip(this.getCurrencies(), this.getCategories());

    calls.subscribe({
      next: () => {
        this.state = ComponentState.LOADED;
        this.updateDropdown();
        this.addTransactionForm.patchValue({
          currency: this.currencies[0]
        });
      },
      error: (err: any) => {
        this.state = ComponentState.ERROR;
        console.log(err);
      }
    });
  }

  updateDropdown(): void {
    this.filteredCategories = this.categories.filter(x => x.isIncome == !this.isExpense);
    this.addTransactionForm.patchValue({ category: this.filteredCategories[0] });
  }

  onSubmit(): void {
    const model = TransactionDtoConverter.convertFormGroup(this.addTransactionForm, this.userId);

    this.cleanAuthError();
    this.requestLoading = true;

    this.transactionApi.addTransaction(model)
      .subscribe({
        next: async () => {
          await this.router.navigate(['transactions', 'list', this.userId])
        },
        error: error => {
          console.error(error);
        },
      })
      .add(() => {
        this.requestLoading = false;
        this.changeDetector.detectChanges();
      })
  }

  cleanAuthError(): void {
    this.authError = '';
  }

  private getCurrencies(): Observable<CurrencyDto[]> {
    return this.transactionApi.getCurrencies()
      .pipe(
        map(response => response.result.items! ),
        tap(result => this.currencies = result)
      );
  }

  private getCategories(): Observable<TransactionCategoryDto[]> {
    return this.transactionApi.getTransactionCategories()
      .pipe(
        map(response => response.result.items! ),
        tap(result => this.categories = result)
      );
  }
}
