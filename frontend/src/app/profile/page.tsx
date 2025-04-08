import { UserCard } from "../ui/UserCard";
import { cookies } from "next/headers";

export default async function ProfilePage() {
  const cookieStore = cookies();
  const jwt = (await cookieStore).get("access_token");
  let res:Response;
  if(jwt){
    res = await fetch("http://localhost:4000/users/access",{method:"GET",headers:{Cookie:`access_token=${jwt.value}`},credentials:"include"});
  }
  else{
    res = await fetch("http://localhost:3000/api/hello",{method:"GET",credentials:"include"});
  }
  const data:{name:string, email:string, id:string, password:string} = await res.json();
  
  return (
    <>
      <UserCard name={data.name} email={data.email} id={data.id} password={data.password}/>      
    </>
  );
}

