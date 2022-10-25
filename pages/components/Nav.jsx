/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link"
import {auth} from '../../utils/firebase'
import {useAuthState} from 'react-firebase-hooks/auth'

export default function Nav(){
    const [user,loading] = useAuthState(auth);

    return(
        <nav className="flex justify-between items-center py-5">
            <Link href="/">
                <a className="text-lg font-medium">Your Thoughts</a>
            </Link>
        
            <ul className="flex items-center gap-10">
                {!user &&(
                    <Link href={"/auth/Login"}>
                        <a className="py-2 px-4 text-sm bg-cyan-500 text-white rounded-lg font-medium ml-8">Join Now</a>
                    </Link>
                )}
                {user && (
                    <div className="flex items-center gap-6">
                    <Link href={"/post"}>
                        <a className="py-2 px-4 text-sm bg-cyan-500 text-white rounded-lg font-medium ml-8">Post</a>
                    </Link>
                    <Link href={"/dashboard"}>
                        <img src={user.photoURL} className="cursor-pointer w-8 rounded-full" />
                    </Link>
                    </div>
                )}
                
            </ul>
        </nav>
    )
}