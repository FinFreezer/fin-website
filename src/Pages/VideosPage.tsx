import axios from 'axios';
import { useEffect, useState } from 'react'
import { Header } from '../components/Header';
import './VideosPage.css'

interface FileNode {
    name: string;
    isDir: boolean;
    children?: FileNode[];
    parent?: FileNode
}

interface ListDirResponse {
    reply: string;
    directory: FileNode;
}

type ReactNodeSetter = React.Dispatch<React.SetStateAction<FileNode>>;
type ReactArraySetter = React.Dispatch<React.SetStateAction<FileNode[]>>;
type ReactStringSetter = React.Dispatch<React.SetStateAction<string>>;

function VideoDisplay({ nowPlaying }: { nowPlaying: string }) {
    return (
        <div className="main-player">
            <video controls width="720" key={nowPlaying}>
                <source src={nowPlaying} />
            </video>
        </div>
    );
}

function Sidebar({ currentDir, setCurrentDir, currentPath, setCurrentPath, nowPlaying, setNowPlaying }: {
    currentDir: FileNode,
    setCurrentDir: ReactNodeSetter,
    currentPath: FileNode[],
    setCurrentPath: ReactArraySetter,
    nowPlaying: string,
    setNowPlaying: ReactStringSetter;
}) {

    const directoryClick = async (child: FileNode) => {
        setCurrentPath([...currentPath, child]);
        setCurrentDir(child);
        /*const response = await axios.get(currentPath);
        const Tree: ListDirResponse = response.data;
        setCurrentDir(Tree.directory);*/
    }

    const backDirectoryClick = async () => {
        const path: Array<FileNode> = currentPath;
        path.pop();
        setCurrentPath(path);
        setCurrentDir(path[path.length-1])
    }

    const setVideoSource = async (file: FileNode) => {
        const sourceString = currentPath
            .map(pathNode => pathNode.name)
            .join('/') + "/" + file.name;
        setNowPlaying(`/api/stream/${sourceString}`)
        console.log(nowPlaying);
    }

    return (
        <>
            <nav className="branches">
                <div className="branches-title" >
                    {currentPath.length > 1 && (
                        <>
                            <a href="#" onClick={
                                (e) => {
                                    e.preventDefault();
                                    backDirectoryClick();
                                }
                            }>{currentPath[currentPath.length - 2].name}</a>
                            {' > '}
                        </>
                    )}
                    {currentDir.name}
                </div>
                <ol>
                    {currentDir.children && currentDir.children.map((child: FileNode) => (
                        <li className="branch" key={child.name}>
                            {child.isDir ? (
                                <a href="#"
                                    onClick={
                                        (e) => {
                                            e.preventDefault();
                                            directoryClick(child);
                                        }
                                    }
                                >
                                    📁{child.name}
                                </a>
                            ) : (
                                <a href="#" onClick={
                                    (e) => {
                                        e.preventDefault();
                                        setVideoSource(child);
                                    }
                                }>▶️{child.name}</a>)}
                        </li>
                    ))}
                </ol>
            </nav>
        </>
    );
}

export function VideosPage() {
    const emptyNode = {} as FileNode;
    const [currentDir, setCurrentDir] = useState(emptyNode);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPath, setCurrentPath] = useState<FileNode[]>([]);
    const [nowPlaying, setNowPlaying] = useState('');

    useEffect(
        () => {
            const displayVideos = async () => {
                const response = await axios.get(`/api/dir/Videos?dirOnly=false&recDepth=99`);
                const Tree: ListDirResponse = response.data;
                setCurrentDir(Tree.directory)
                setCurrentPath([Tree.directory])
                setIsLoading(false);
            }

            displayVideos();
        }, []
    )

    if (isLoading) {
        return (
            <>
                <title>Videos</title>
                <Header />
                <div className="videos-page">
                    <div className="loading">Loading directories...</div>
                </div>
            </>
        );
    }
    return (
        <>
            <title>Videos</title>
            <Header />
            <div className="videos-page">
                <Sidebar currentDir={currentDir} setCurrentDir={setCurrentDir} currentPath={currentPath} setCurrentPath={setCurrentPath} nowPlaying={nowPlaying} setNowPlaying={setNowPlaying} />
                <VideoDisplay nowPlaying={nowPlaying} />
            </div>
        </>
    );
} 