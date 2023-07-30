import { ComputedRanking, Ranking } from "../types/types";

export const getComputedRanking = (ranking: Ranking[], pastRanking: Ranking[]) => {
    let finalRanking: ComputedRanking[] = [];
    const userDifferenceMap = new Map<string, number>();

    for (const rank of ranking) {
        userDifferenceMap.set(rank.userUid, rank.rank);
    } 

    for (const rank of pastRanking) {
        if (userDifferenceMap.get(rank.userUid) === undefined) {
            // User no longer exists
            continue;
        } 
        userDifferenceMap.set(rank.userUid, rank.rank - userDifferenceMap.get(rank.userUid)!);
    }

    finalRanking = ranking.map(rank => ({
        ...rank,
        difference: userDifferenceMap.get(rank.userUid)!
    }));

    return finalRanking;
}