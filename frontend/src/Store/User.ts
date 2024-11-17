import { makeAutoObservable } from "mobx"



export class User{
  static fromProps(props: User){
    const user = new User(props.username, props._id, props.blocked, props.isAdmin, props.date_registered, props.isOperator, props.email)
    return user
  }

  constructor(
      public username: string,
      public _id: string,
      public blocked: string,
      public isAdmin: string,
      public date_registered: string,
      public isOperator: boolean,
      public email?: string,
  ){
    makeAutoObservable(this)
  }
}