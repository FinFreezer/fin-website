import axios from 'axios';
import { useEffect, useState } from 'react'
import { Header } from '../components/Header';
import './VideosPage.css'

export function VideosPage() {
    interface FileNode {
        name: string;
        isDir: boolean;
        children?: FileNode[];
    }

    interface ListDirResponse {
        reply: string;
        directory: FileNode;
    }
    useEffect(
        () => {
            const displayVideos = async () => {
                const response = await axios.get('/api/dir/Videos?dirOnly=false&recDepth=99');
                const Tree: ListDirResponse = response.data;
                console.log(Tree.directory);

            }
            displayVideos();
        }, []
    )
    

    return(
        <>
            <title>Videos</title>
            <Header />
            <div className="videos-page">
            </div>
        </>
    );
}