
export interface TimeCheckService {
    openShift: (userId: string) => Promise<string>;
    closeShift: (userId: string) => Promise<number>; //return closed shift duration
    breakTime:(userId:string, breakTime:number) => Promise<void>;
}