class Dependencies {
    localstorage: ...
    userRemote: Remote<string>;
    productRemote: Remote<number>;

    constructor() {
        this.userRemote = new Users2Remote();
    }
}


interface Remote<T> {
    getList: T[];
}

class UsersV1Remote implements Remote<string> {
    getList: string[]() {

    }

}

class UserV2Remote implements Remote<string> {
    getList: string[]() {

    }

}

class ProductRemote implements Remote<number> {
    getList: number[]() {

    }


}

Home {
 dependencies.usersRemote.getList()
}