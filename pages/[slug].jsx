import Layout from "./components/Layout"
import { useRouter } from "next/router"
import Message from "./components/Message";
import { useEffect, useState } from "react";
import {auth,db} from '../utils/firebase'
import { toast,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import { arrayUnion, Timestamp, updateDoc, doc, getDoc, onSnapshot } from "firebase/firestore";
import Link from "next/link";
import {BiArrowBack} from 'react-icons/bi';

const Detail = () => {

  const route = useRouter();
  const routeData = route.query;
  const [comment,setComment] = useState("");
  const [allComment,setAllComment] = useState([]);

  const sendComment = async() => {
    if(!auth.currentUser){
        return route.push("/auth/Login");
    }
    if(!comment){
        toast.error("Comment is empty");
    }
    if(comment){
        const docRef = doc(db,'posts',routeData.id);
        const updateData = {comments:arrayUnion({
            comment,
            avatar:auth.currentUser.photoURL,
            username:auth.currentUser.displayName,
            time:Timestamp.now(),
        })};

        await updateDoc(docRef,updateData);
    }
    setComment("");

  };

  const getComment = async () => {
   const docRef =  doc(db,'posts',routeData.id);
   const unsub = onSnapshot(docRef,(snapshot) => {
   setAllComment(snapshot.data().comments);
   })
   return unsub;
  //  const docSnap = await  getDoc(docRef);
  //  setAllComment(docSnap.data().comments);
  }

  useEffect(()=>{
    if(!route.isReady) return;
    if(route.isReady) getComment();
  },[route.isReady])

  return (
    <Layout>
        <ToastContainer></ToastContainer>
        <Message {...routeData}>
            <div className="mt-4 flex">
                <input type="text" value={comment} onChange={(e)=>setComment(e.target.value)} className="bg-gray-700 text-white p-2 w-full" placeholder="Write a comment" />
                <button className="bg-cyan-500 py-1 px-4 text-white" onClick={sendComment}>Post</button>
            </div>
        </Message>
        <div className="mb-4">
            <h3>Comments</h3>
            <div>
                  {allComment.map((comment) => (
                    <div className="my-3" key={comment.time}>
                      <div className="flex gap-2 items-center">
                        <img src={comment.avatar} className="w-8 rounded-full "/>
                        <p className="font-light">{comment.username}</p>
                      </div>
                      <p>{comment.comment}</p>
                    </div>
                  ))}
            </div>
        </div>
        <Link href="/">
          <button className="bg-gray-700 text-white rounded-lg py-1 px-3 flex items-center"><BiArrowBack/>Back</button>
        </Link>
    </Layout>
  )
}

export default Detail