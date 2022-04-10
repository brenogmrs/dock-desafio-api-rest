export interface IRepository<T> {
    findAll(): Promise<T[]>;
    findById(accountHolderId: string): Promise<T | undefined>;
    update(customer: T): Promise<T>;
    delete(customer: T): Promise<void>;
}
