import Layout from '../pages/components/Layout'
import {auth,db} from '../utils/firebase'
import {useAuthState} from 'react-firebase-hooks/auth'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import Message from './components/Message';
import {BsTrash2Fill} from 'react-icons/bs';
import {AiFillEdit} from 'react-icons/ai';
import {BiLogOut} from 'react-icons/bi';
import Link from 'next/link';

export default function Dashboard(){

    const [user,loading] = useAuthState(auth);
    const [posts,setPosts] = useState([]);

    const getPost = async() => {
        const collectionFromDb = collection(db,'posts');
        const q = query(collectionFromDb,where('user','==',user.uid));

        const unsub = onSnapshot(q,(snapshot) => {
            setPosts(snapshot.docs.map((doc) => ({
                ...doc.data(),id:doc.id
            })))
            return unsub;
        });
    }

    const deletePost = async(id) => {
        const docRef = doc(db,'posts',id);
        await deleteDoc(docRef);
    }
    
    const route = useRouter();
    useEffect(()=>{
        if(!user){
            route.push("/")
        }
    },[user,loading]);

    useEffect(()=>{
        getPost()
    },[]);

    return (
        <Layout>
            <h1>Your Posts</h1>
            <h3>
                {posts.map((post)=>{
                    return (
                    <Message {...post}>
                        <div className='flex gap-4 mt-4'>
                          <button onClick={()=>deletePost(post.id)} className='flex gap-2 py-2 px-3 rounded-lg items-center border-solid border-2 border-red-500 text-red-500'>
                            <BsTrash2Fill/>Delete
                          </button>
                          <Link href={{pathname : '/post',query:post}}>
                            <button className='flex gap-2 py-2 px-3 rounded-lg items-center border-solid border-2 border-teal-500 text-teal-500'>
                                <AiFillEdit/> Edit
                            </button>
                          </Link>
                        </div>
                    </Message>)
                })}
            </h3>
            <button onClick={()=>auth.signOut()} className="flex items-center gap-2 py-2 px-3 rounded-lg bg-black text-white"><BiLogOut/> Sign Out</button>
        </Layout>
    )
}