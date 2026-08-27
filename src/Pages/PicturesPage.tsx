import axios from 'axios';
import { useEffect, useState, useCallback } from 'react'
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

function ImageDisplay({
    nowDisplaying,
    setNowDisplaying,
    currentPage,
    setCurrentPage,
}: {
    nowDisplaying: string,
    setNowDisplaying: ReactStringSetter,
    currentPage: number,
    setCurrentPage: ReactNumberSetter;
}
) {

    const forwardClick = async () => {
        const newDisplay = nowDisplaying.replace(`Page=${currentPage}`, `Page=${currentPage + 1}`);
        setCurrentPage(currentPage + 1);
        setNowDisplaying(newDisplay);
    }

    const backwardClick = async () => {
        const newDisplay = nowDisplaying.replace(`Page=${currentPage}`, `Page=${currentPage - 1}`);
        setCurrentPage(currentPage - 1);
        setNowDisplaying(newDisplay);
    }

    return (
        <div className="main-display-window">
            <button className="main-display-window-button"
                onClick={backwardClick}>◀</button>
            {nowDisplaying !== '' ?
                (
                    <div className="double-page">
                        <img className="main-display-1"
                            alt="Currently displayed page."
                            src={nowDisplaying} 
                            key={nowDisplaying} 
                            title="Tip: You can use arrow keys to navigate" />
                        <img className="main-display-2"
                            alt="Currently displayed page."
                            src={nowDisplaying} 
                            key={nowDisplaying+1} 
                            title="Tip: You can use arrow keys to navigate" />
                    </div>
                ) : (
                    <p className="display-placeholder-text">Choose an image archive.</p>
                )
            }
            <button className="main-display-window-button" onClick={forwardClick}>▶</button>
        </div>
    );
}

function Sidebar(
    { currentDir, setCurrentDir,
        currentPath, setCurrentPath,
        setNowDisplaying,
        currentPage, setCurrentPage,
    }: {
        currentDir: FileNode,
        setCurrentDir: ReactNodeSetter,
        currentPath: FileNode[],
        setCurrentPath: ReactArraySetter,
        setNowDisplaying: ReactStringSetter,
        currentPage: number,
        setCurrentPage: ReactNumberSetter;
    }
) {

    const directoryClick = async (child: FileNode) => {
        setCurrentPath([...currentPath, child]);
        setCurrentDir(child);
        setCurrentPage(1);
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
        setNowDisplaying(`/api/streamarchive/${sourceString}?Page=${currentPage}`);
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
            const displayImages = async () => {
                const response = await axios.get(`/api/dir/Pictures?dirOnly=false&recDepth=99`);
                const Tree: ListDirResponse = response.data;
                setCurrentDir(Tree.directory)
                setCurrentPath([Tree.directory])
                setIsLoading(false);
            }

            displayImages();
        }, []
    )


    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        const forwardClick = async () => {
            const newDisplay = nowDisplaying.replace(`Page=${currentPage}`, `Page=${currentPage + 1}`);
            setCurrentPage(currentPage + 1);
            console.log(currentPage);
            setNowDisplaying(newDisplay);
        }

        const backwardClick = async () => {
            const newDisplay = nowDisplaying.replace(`Page=${currentPage}`, `Page=${currentPage - 1}`);
            setCurrentPage(currentPage - 1);
            console.log(currentPage);
            setNowDisplaying(newDisplay);
        }
        switch (event.key) {
            case 'ArrowRight':
                event.preventDefault();
                forwardClick();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                backwardClick();
                break;
            default:
                break;
        }
    }, [currentPage, nowDisplaying]);

    useEffect(
        () => {
            document.addEventListener('keydown', handleKeyDown);

            return () => {
                document.removeEventListener('keydown', handleKeyDown);
            }
        }, [handleKeyDown]
    )

    if (isLoading) {
        return (
            <>
                <title>Comics</title>
                <Header />
                <div className="pictures-page">
                    <div className="loading">Loading directories...</div>
                </div>
            </>
        );
    }
    return (
        <>
            <title>Comics</title>
            <Header />
            <div className="pictures-page">
                <ImageDisplay
                    nowDisplaying={nowDisplaying}
                    setNowDisplaying={setNowDisplaying}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage} />
                <Sidebar
                    currentDir={currentDir}
                    setCurrentDir={setCurrentDir}
                    currentPath={currentPath}
                    setCurrentPath={setCurrentPath}
                    setNowDisplaying={setNowDisplaying}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage} />
            </div>
        </>
    );
} 