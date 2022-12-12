import { Component, Inject, OnInit } from '@angular/core';
import { AddInvoiceDto, InvoiceDto, TransactionApiService, TransactionDto } from "../../services/transaction/transaction.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { LocationStrategy } from "@angular/common";

@Component({
  selector: 'app-invoice-popup',
  templateUrl: './invoice-popup.component.html',
  styleUrls: ['./invoice-popup.component.css']
})
export class InvoicePopupComponent implements OnInit {
  invoices: InvoiceDto[] = [];
  displayedColumns: string[] = ['name', 'icons'];

  constructor(
    public dialogRef: MatDialogRef<InvoicePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public transaction: TransactionDto,
    private transactionApi: TransactionApiService,
    private locationStrategy: LocationStrategy
  ) {
    window.addEventListener('file-upload' as keyof WindowEventMap, this.addInvoiceEvent);
  }

  ngOnInit(): void {
    this.invoices = this.transaction.invoices?.items!;
    const customEvent = new CustomEvent('reveal-upload')
    window.dispatchEvent(customEvent);
  }

  ngOnDestroy(): void {
    const customEvent = new CustomEvent('hide-upload');
    window.dispatchEvent(customEvent);
    window.removeEventListener('file-upload' as keyof WindowEventMap, this.addInvoiceEvent);
  }

  addInvoiceEvent = (evt: Event) => {
    const { detail } = <CustomEvent>evt || {};
    this.addInvoice(detail);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addInvoice(guid: string): void {
    const model = {
      transactionId: this.transaction.id,
      fileId: guid
    } as AddInvoiceDto

    this.transactionApi.addInvoice(model).subscribe({
      next: response => {
        const model = {fileId: guid, fileMetadata: response.result} as InvoiceDto;
        this.dialogRef.componentInstance.invoices = [...this.invoices, model];
      },
      error: (err: any) => console.error(err)
    }).add(() => {
      const customEvent = new CustomEvent('clear-upload');
      window.dispatchEvent(customEvent);
    });
  }

  deleteInvoice(guid: string): void {
    this.transactionApi.deleteInvoice(guid).subscribe({
      next: () => {
        this.transaction!.invoices!.items = this.transaction.invoices?.items?.filter(x => x.fileId !== guid);
        this.invoices = this.invoices.filter(x => x.fileId !== guid);
      },
      error: (err: any) => console.error(err)
    });
  }

  downloadInvoice(guid: string): void {
    const url = this.locationStrategy.getBaseHref();
    const handle = window.open(`${url}/files/download/${guid}`);

    handle!.blur();
    window.focus();
  }
}
