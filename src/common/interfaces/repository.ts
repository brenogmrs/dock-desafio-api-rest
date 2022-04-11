export interface IRepository<T> {
    findAll(): Promise<T[]>;
    findById(accountHolderId: string): Promise<T | undefined>;
    update(entity: T): Promise<T>;
    delete(entity: T): Promise<void>;
}
