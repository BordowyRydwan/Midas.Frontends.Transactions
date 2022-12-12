import { FormGroup } from "@angular/forms";
import { TransactionDto } from "../../services/transaction/transaction.service";

export class TransactionDtoConverter {
  public static convertFormGroup(formGroup: FormGroup, userId: number, transactionId?: number): TransactionDto {
    return {
      title: formGroup.controls['title'].value,
      description: formGroup.controls['description'].value,
      recipientName: formGroup.controls['recipientName'].value,
      amount: formGroup.controls['amount'].value,
      currency: formGroup.controls['currency'].value,
      transactionCategory: formGroup.controls['category'].value,
      userId: userId,
      id: transactionId ?? 0,
    } as TransactionDto;
  }

  public static convertToFormGroup(formGroup: FormGroup, transaction: TransactionDto): void {
    formGroup.patchValue({
      title: transaction.title,
      recipientName: transaction.recipientName,
      description: transaction.description,
      amount: transaction.amount,
      currency: transaction.currency,
      category: transaction.transactionCategory
    });
  }
}
