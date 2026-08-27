import axios from 'axios';
import { useEffect, useState } from 'react'
import { Header } from '../components/Header';
import './PicturesPage.css'

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
type ReactNumberSetter = React.Dispatch<React.SetStateAction<number>>;

function ImageDisplay({ nowDisplaying }: { nowDisplaying: string }) {

    return (
        <div className="main-display-window">
            <button className="main-display-window-button">◀</button>
            {nowDisplaying !== '' ?
                (<img className="main-display" src={nowDisplaying} key={nowDisplaying}>
                </img>
                ) : (
                    <p className="display-placeholder-text">Choose an image archive.</p>)
            }
            <button className="main-display-window-button">▶</button>
        </div>
    );
}

function Sidebar(
    { currentDir, setCurrentDir,
        currentPath, setCurrentPath,
        nowDisplaying, setNowDisplaying,
        currentPage, setCurrentPage,
    }: {
        currentDir: FileNode,
        setCurrentDir: ReactNodeSetter,
        currentPath: FileNode[],
        setCurrentPath: ReactArraySetter,
        nowDisplaying: string,
        setNowDisplaying: ReactStringSetter,
        currentPage: number,
        setCurrentPage: ReactNumberSetter;
    }
) {

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
        setCurrentDir(path[path.length - 1])
    }

    const setImageSource = async (file: FileNode) => {
        const sourceString = currentPath
            .map(pathNode => pathNode.name)
            .join('/') + "/" + file.name;
        setNowDisplaying(`/api/streamarchive/${sourceString}?Page=${currentPage}`)
        console.log(nowDisplaying);
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
                                        setImageSource(child);
                                    }
                                }>📖{child.name}</a>)}
                        </li>
                    ))}
                </ol>
            </nav>
        </>
    );
}

export function PicturesPage() {
    const emptyNode = {} as FileNode;
    const [currentDir, setCurrentDir] = useState(emptyNode);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPath, setCurrentPath] = useState<FileNode[]>([]);
    const [nowDisplaying, setNowDisplaying] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(
        () => {
            const displayVideos = async () => {
                const response = await axios.get(`/api/dir/Pictures?dirOnly=false&recDepth=99`);
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
                <div className="pictures-page">
                    <div className="loading">Loading directories...</div>
                </div>
            </>
        );
    }
    return (
        <>
            <title>Videos</title>
            <Header />
            <div className="pictures-page">
                <Sidebar
                    currentDir={currentDir}
                    setCurrentDir={setCurrentDir}
                    currentPath={currentPath}
                    setCurrentPath={setCurrentPath}
                    nowDisplaying={nowDisplaying}
                    setNowDisplaying={setNowDisplaying}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage} />
                <ImageDisplay nowDisplaying={nowDisplaying} />
            </div>
        </>
    );
} 