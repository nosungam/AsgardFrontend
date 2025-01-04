export interface StatsDTO {
    scorePerDay: {
        date: string;
        score: number;
    }[];
    amountsOfFlashcards: {
        folderName: string;
        amount: number;
    }[];
    bestStrike: number
    daysStudiedInLast30Days:number
}