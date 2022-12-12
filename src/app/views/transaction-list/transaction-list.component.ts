import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CookieService } from "../../services/cookie/cookies.service";
import { ActivatedRoute, Router } from "@angular/router";
import { firstValueFrom } from "rxjs";
import ComponentState from "../../../enums/component-state";
import { TransactionApiService, TransactionDto } from "../../services/transaction/transaction.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { TransactionPopupComponent } from "../../components/transaction-popup/transaction-popup.component";
import { MatDialog } from "@angular/material/dialog";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { InvoicePopupComponent } from "../../components/invoice-popup/invoice-popup.component";

@Component({
  selector: 'app-transaction-edit-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {
  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    this.transactions.paginator = paginator;
  }
  @ViewChild(MatSort) set sort(sort: MatSort) {
    this.transactions.sort = sort;
  }

  state = ComponentState.LOADING;
  states = ComponentState;
  transactions: MatTableDataSource<TransactionDto> = new MatTableDataSource<TransactionDto>([]);
  userId: number = 0;

  displayedColumns: string[] = [
    'title',
    'recipientName',
    'amount',
    'currency',
    'category',
    'date',
    'icons'
  ];

  constructor(
    private transactionApi: TransactionApiService,
    private route: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService,
    private jwtService: JwtHelperService,
    public dialog: MatDialog,
  ) {}

  get sum(): string {
    return this.transactions.data
      .reduce((a, b) =>
        a + (b.transactionCategory!.isIncome! ? 1 : -1) * (b.amount!) * (b.currency?.factorToDefaultCurrency!), 0)
      .toLocaleString("pl-PL", { maximumFractionDigits: 2, minimumFractionDigits: 2});
  }

  async ngOnInit(): Promise<void> {
    this.userId = await this.getUserId();
    this.getTransactions();

    this.transactions.paginator = this.paginator;
    this.transactions.sort = this.sort;
  }

  deleteTransaction(id: number): void {
    this.transactionApi.deleteTransaction(id)
      .subscribe({
        next: () => {
          this.transactions.data = this.transactions.data.filter(x => x.id !== id);
        },
        error: error => {
          console.error(error);
          this.state = ComponentState.ERROR;
        },
      });
  }

  openTransactionDialog(item: TransactionDto): void {
    const dialogRef = this.dialog.open(TransactionPopupComponent, { data: item });
    dialogRef.afterClosed().subscribe(() => this.getTransactions());
  }

  openInvoiceDialog(item: TransactionDto): void {
    const dialogRef = this.dialog.open(InvoicePopupComponent, { data: item });
    dialogRef.afterClosed().subscribe(() => this.getTransactions());
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.transactions.filter = filterValue.trim().toLowerCase();

    if (this.transactions.paginator) {
      this.transactions.paginator.firstPage();
    }
  }

  getAmount(item: TransactionDto): string {
    const convertedBool = item.transactionCategory!.isIncome! ? 1 : -1;
    const amount = item.amount! * convertedBool;
    const result = amount!.toLocaleString("pl-PL", { maximumFractionDigits: 2, minimumFractionDigits: 2});

    return result;
  }

  private getTransactions(): void {
    this.transactionApi.getTransactionsForUser(this.userId)
      .subscribe({
        next: response => {
          this.transactions.data = response.result.items! ?? [];
          this.state = ComponentState.LOADED;
        },
        error: error => {
          console.error(error);
          this.state = ComponentState.ERROR;
        },
      });
  }

  private async getUserId(): Promise<number> {
    const snapshot = this.route.snapshot.paramMap.get('userid');

    if (snapshot) {
      return Number.parseInt(snapshot);
    }

    const token = await firstValueFrom(this.cookieService.getCookie('USER_SESSION'));
    const decodedToken = this.jwtService.decodeToken(token!);
    const property = Object.keys(decodedToken).find(x => x.split('/').at(-1) === 'nameidentifier');

    if (!property) {
      return 0;
    }

    return Number.parseInt(decodedToken[property]);
  }
}
