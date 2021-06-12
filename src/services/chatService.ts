import chatStore from "../store/chatStore";
import gameStore from "../store/gameStore";

export default {
    async isInRoom(chatId: string, username: string) {
        const isInChatRoom = await chatStore.isInRoom(chatId, username);
        const isInGame = await gameStore.hasPlayer(chatId, username);
        return isInChatRoom || isInGame;
    },
};
