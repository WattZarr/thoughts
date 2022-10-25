import Layout from "../components/Layout"
import {FcGoogle} from 'react-icons/fc'
import {signInWithPopup,GoogleAuthProvider} from 'firebase/auth'
import {auth} from '../../utils/firebase'
import {useRouter} from 'next/router'
import {useAuthState} from 'react-firebase-hooks/auth'
import { useEffect } from "react"

export default function Login(){
    
    const [user,loading] = useAuthState(auth);
    const route = useRouter();
    const provider = new GoogleAuthProvider();
    const GoogleLogin = async() =>{
      try{
        const result = await signInWithPopup(auth,provider);
        route.push("/");
      }catch(error){
        console.log(error);
      }
      
    }

    useEffect(()=>{
      if(user){
        route.push("/");
      }
    },[user]);

    return (
        <Layout>
            <div className="shadow-xl py-10 px-15 my-auto text-gray-700">
                <h2 className="text-2xl py-4">Join Today</h2>
                <div>
                    <h3 className="py-4">Sign in with one of our provider</h3>
                    <button onClick={GoogleLogin} className="bg-gray-700 text-white w-full py-3 flex items-center gap-4 rounded-lg">
                    <FcGoogle className="ml-2"/>Sign in with Google
                    </button>
                </div>
            </div>
        </Layout>
    )
}