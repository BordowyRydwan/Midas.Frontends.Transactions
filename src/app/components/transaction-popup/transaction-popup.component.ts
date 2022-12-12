import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {
  CurrencyDto,
  TransactionApiService,
  TransactionCategoryDto,
  TransactionDto
} from "../../services/transaction/transaction.service";
import { map, Observable, tap, zip } from "rxjs";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { TransactionDtoConverter } from "../../helpers/model-converters/transaction-dto";

@Component({
  selector: 'app-transaction-popup',
  templateUrl: './transaction-popup.component.html',
  styleUrls: ['./transaction-popup.component.css']
})
export class TransactionPopupComponent implements OnInit{
  requestLoading = false;
  categories: TransactionCategoryDto[] = [];
  currencies: CurrencyDto[] = [];

  isExpense = false;
  filteredCategories: TransactionCategoryDto[] = [];

  editTransactionForm = new FormGroup({
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
    public dialogRef: MatDialogRef<TransactionPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public transaction: TransactionDto,
    private transactionApi: TransactionApiService,
  ) {}

  ngOnInit(): void {
    TransactionDtoConverter.convertToFormGroup(this.editTransactionForm, this.transaction);
    const calls = zip(this.getCurrencies(), this.getCategories());

    calls.subscribe({
      next: () => {
        this.isExpense = !this.transaction.transactionCategory?.isIncome;
        this.updateDropdown();
        this.editTransactionForm.patchValue({
          currency: this.currencies.find(x => x.code == this.transaction.currency?.code),
          category: this.filteredCategories.find(x => x.id == this.transaction.transactionCategory?.id)
        });
      },
      error: (err: any) => {
        console.error(err);
        this.onNoClick();
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    const model = TransactionDtoConverter.convertFormGroup(this.editTransactionForm, this.transaction.userId!, this.transaction.id);

    this.requestLoading = true;
    this.transactionApi.modifyTransaction(model)
      .subscribe({
        next: () => this.onNoClick(),
        error: error => console.error(error),
      })
      .add(() => {
        this.requestLoading = false;
      })
  }

  updateDropdown(): void {
    this.filteredCategories = this.categories.filter(x => x.isIncome == !this.isExpense);
    this.editTransactionForm.patchValue({ category: this.filteredCategories[0] });
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
