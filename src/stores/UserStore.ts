import { decorate, action, observable, computed } from 'mobx';
import User from "../interfaces/User";

class UserStore {
    isAuthenticated: Boolean;
    user : User | undefined
    constructor() {
        this.isAuthenticated = false;
    }
    get getUser(): User {
        return this.user;
    }
    setUser(user: User) {
        this.user = user
    }
    get getAuthenticated(): Boolean {
        return this.isAuthenticated
    }
    setAuthenticated(authenticated: Boolean) {
        this.isAuthenticated = authenticated
    }
}

decorate(UserStore, {
    isAuthenticated: observable,
    user: observable,
    getAuthenticated: computed,
    setAuthenticated: action,
    getUser: computed,
    setUser: action
})

export default UserStore;