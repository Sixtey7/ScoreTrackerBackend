enum GameList {
    AGRICOLA,
    CARCASSONNE,
    LORDS_OF_WATERDEEP,
    CASTLES_OF_BURGANDY
}

namespace GameList {
    export function fromReadableString(_readable: string): GameList {
        switch (_readable.toUpperCase()) {
            case "AGRICOLA":
                return GameList.AGRICOLA;
            case "CARCASSONNE":
                return GameList.CARCASSONNE;
            case "LORDS OF WATERDEEP":
                return GameList.LORDS_OF_WATERDEEP;
            case "CASTLES OF BURGANDY":
                return GameList.CASTLES_OF_BURGANDY;
            default:
                return null;
        }
    }
};

export {
    GameList
};