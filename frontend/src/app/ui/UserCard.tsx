import "./UserCard.css"
import { User } from "../lib/definitions"


export function UserCard({name, userName}:User){
    return (
      <article className="user-card">
        <header className="user-card-header">
          <img className="user-card-img" alt="avatar" src={`https://unavatar.io/${userName}`}/>
          <div className="user-card-info">
            <strong>{name}</strong>
            <span className="user-card-info-userName">@{userName}</span>
          </div>
        </header>
        <aside>
          <button className="user-card-button-follow">Follow</button>
        </aside>
      </article>
    )
  };

//import { UserCard } from "./ui/UserCard"  
//<section className="users-list">
//  <UserCard name="Diana" userName="didi9595"/>
//  <UserCard name="Vic" userName="herav"/>
//  <UserCard name="Una Kravets" userName="una"/>
//</section>