export const parsePayload = (payload) => {
    const separatorIndex = payload.indexOf(':');
    const message = payload.substring(separatorIndex + 1);
    const userNameColor = payload.substring(0, separatorIndex);
    const secondSeperatorIndex = message.indexOf(':');
    const userName = message.substring(0,secondSeperatorIndex);
    const text = message.substring(secondSeperatorIndex + 1);
    return { userNameColor, userName, text, date: new Date() };
}
