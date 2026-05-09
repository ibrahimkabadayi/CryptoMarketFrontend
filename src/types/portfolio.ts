export interface Dashboard
{
    walletId: string,
    address: string,
    fiatBalance: number,
    totalInvestedValue: number,
    assets: Asset[],
    recentTransactions: Transaction[]
}

export interface Asset
{
    symbol: string,
    quantity: number,
    averageBuyPrice: number,
    investedAmount: number
}

export interface Transaction
{
    symbol: string,
    amount: number,
    priceAtTransaction: number,
    transactionType: TransactionType
}

enum TransactionType
{
    sell,
    buy,
    transfer,
    deposit,
    withdraw
}