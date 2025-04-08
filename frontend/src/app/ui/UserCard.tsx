import "./UserCard.css"

type USERCARD={
  name:string,
  email:string
  id:string,
  password:string
}

export function UserCard({name,email,id,password}:USERCARD){
    return (
      <article className="user-card">
        <div className="user-card-header">
          <img className="user-card-img" alt="avatar" src={`https://unavatar.io/${name}`}/>
          <div className="user-card-info">
            <span className="user-card-info-name">@{name}</span>
            <strong>{email}</strong>
            <strong>{id}</strong>
            <strong>{password}</strong>
          </div>
        </div>
      </article>
    )
  };
