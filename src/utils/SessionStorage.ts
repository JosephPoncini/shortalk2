// Session Storage Functions

// sess
export const saveToSessionStorage = (username: string) => {
    // let sess = getSessionStorage();
    // if (!sess.includes(username)) {
    //     sess.push(username);
    // }

    sessionStorage.setItem("Username", username);
}

export const getSessionStorage = (): string[] => {
    let sessionStorageData = sessionStorage.getItem("Weather sess");

    if (sessionStorageData == null) {
        return [];
    }

    return JSON.parse(sessionStorageData);
}

export const removeFromSessionStorage = (city: string, country: string) => {
    let sess = getSessionStorage();
    let location = city + ", " + country;

    let namedIndex = sess.indexOf(location);

    sess.splice(namedIndex, 1);

    sessionStorage.setItem("Weather sess", JSON.stringify(sess));
}
