import Layout from "./components/Layout"
import {auth,db} from '../utils/firebase'
import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import {useEffect,useState} from 'react'
import Message from "./components/Message";
import Link from "next/link";


export default function Home() {

  const [allPost,setAllPost] = useState([]);

  const getPosts = async()=>{
    const collectionFromDb = collection(db,'posts');
    const q = query(collectionFromDb,orderBy('timestamp','desc'));
 

    const unsub = onSnapshot(q,(snapshot) => {
      setAllPost(snapshot.docs.map((doc) => ({
        ...doc.data(),id:doc.id
      })))
    });
    return unsub;
  }

  useEffect(()=>{
    getPosts();
  },[])

  
  return (
      <Layout>
        <div className="my-4">
        <h2 className="font-light text-lg mb-4">See others thoughts</h2>
        {allPost.map((post) => (
          <Message {...post} key={post.id}>
            <Link href={{pathname:`/${post.id}`,query:post}}>
              <div className="mt-5 font-light">
                <button className="border-solid border-2 border-black py-1 px-2 rounded-lg">{post.comments?.length>0 ? post.comments?.length : "0"} Comment</button>
              </div>
            </Link>
          </Message>
        ))}
        </div>
      </Layout>
  )
}
