import Layout from '../pages/components/Layout';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import { addDoc, collection, serverTimestamp,doc,updateDoc } from 'firebase/firestore';
import {auth,db} from '../utils/firebase'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';

export default function Post(){

    const [post,setPost] = useState({description:""});
    const [user,loading] = useAuthState(auth);
    const route = useRouter();
    const routeData = route.query;
    const submitPost = async(e) => {
        e.preventDefault();
        if(post.description.length > 300){
            toast.error("Description is limit to 300 words.");
        }
        if(post.description.length  == 0){
            toast.error("Description is empty");
        }
        if(post.description.length < 300 && post.description.length > 0){
            if(post?.hasOwnProperty("id")){

                const docRef = doc(db,'posts',post.id);
                const updatePost = {...post,timestamp:serverTimestamp()};
                updateDoc(docRef,updatePost);
                toast.success("Your Post is edited successfully!")
                setTimeout(()=>{route.push("/")},3000)

            }else{

                const collectionFromDb = collection(db,'posts');

                await addDoc(collectionFromDb,{
                    ...post,
                    timestamp:serverTimestamp(),
                    user:user.uid,
                    avatar:user.photoURL,
                    username:user.displayName
                });

                setPost({description:""});
                toast.success("Your post is posted successfully!");
                setTimeout(()=>{route.push("/")},3000)
            }
        }
        
    }

    const checkUser = async() => {
        if(!user){
            route.push('auth/Login')
        }
        if(routeData.id){
            setPost({description:routeData.description,id:routeData.id});
        }
        }

    useEffect(()=>{
        checkUser();
    },[user,loading]);

    return (
        <Layout>
             <ToastContainer></ToastContainer>
            <form onSubmit={submitPost} className="p-10 shadow-lg md:w-full">
                <h1 className="text-2xl py-2">
                    {routeData.id ? "Edit Your Post" : "Create a new post"}
                </h1>
                <div className="my-5">
                    <h3 className="font-light mb-2">Description</h3>
                    <textarea value={post.description} onChange={(e)=>setPost({...post,description:e.target.value})} className="bg-gray-800 w-full h-40 text-white mb-2"></textarea>
                    <p className={`font-thin ${post.description.length > 300 ? "text-red-500" : "" }`}>{post.description.length}/300</p>
                </div>
                <button type="submit" className="w-full bg-cyan-500 text-white p-2 rounded-lg">
                {routeData.id ? "Edit" : "Post"}
                </button>
            </form>
        </Layout>
    )
}