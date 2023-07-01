import { useContext } from "react";
// import Register from "./pages/RegisterAndLoginForm";
import RegisterAndLoginForm from "./Pages/RegisterAndLoginForm";
import { UserContext } from "./UserContext";
// import Chat from "./components/Chat";
import Chat from "./Pages/Chat";

export default function Routes(){
    const {username, id } = useContext(UserContext);

    if(username){
        return <Chat/>
    }
    return (
        <RegisterAndLoginForm/>
    )
}