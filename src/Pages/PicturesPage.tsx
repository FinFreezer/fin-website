import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import { Header } from '../components/Header';
import { ShiftPage } from '../utils/shiftPage';
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

interface PageObject {
    pageOneSource: string;
    pageTwoSource: string;
}

type ReactNodeSetter = React.Dispatch<React.SetStateAction<FileNode>>;
type ReactArraySetter = React.Dispatch<React.SetStateAction<FileNode[]>>;
//type ReactStringSetter = React.Dispatch<React.SetStateAction<string>>;
type ReactNumberSetter = React.Dispatch<React.SetStateAction<number>>;
type ReactPageSetter = React.Dispatch<React.SetStateAction<PageObject>>;

function ImageDisplay({
    nowDisplaying,
    setNowDisplaying,
    currentPage,
    setCurrentPage,
}: {
    nowDisplaying: PageObject,
    setNowDisplaying: ReactPageSetter,
    currentPage: number,
    setCurrentPage: ReactNumberSetter;
}
) {

    const forwardClick = async () => {
        /*const NewPage: PageObject = {
            pageOneSource: nowDisplaying.pageOneSource.replace(`Page=${currentPage}`, `Page=${currentPage - 2}`),
            pageTwoSource: nowDisplaying.pageTwoSource.replace(`Page=${currentPage+1}`, `Page=${currentPage - 1}`),
        }
        const newDisplay = nowDisplaying.pageOneSource.replace(`Page=${currentPage}`, `Page=${currentPage + 1}`);*/
        const nextPage = currentPage + 2;
        setCurrentPage(nextPage);
        const NewPage = ShiftPage(nowDisplaying, nextPage);
        console.log(nowDisplaying);
        setNowDisplaying(NewPage);
    }

    const backwardClick = async () => {
        /*const NewPage: PageObject = {
            pageOneSource: nowDisplaying.pageOneSource.replace(`Page=${currentPage}`, `Page=${currentPage - 2}`),
            pageTwoSource: nowDisplaying.pageTwoSource.replace(`Page=${currentPage+1}`, `Page=${currentPage - 1}`),
        }
        const newDisplay = nowDisplaying.pageOneSource.replace(`Page=${currentPage}`, `Page=${currentPage + 1}`);*/
        const previousPage = currentPage - 2;
        setCurrentPage(previousPage);
        const NewPage = ShiftPage(nowDisplaying, previousPage)
        console.log(nowDisplaying);
        setNowDisplaying(NewPage);
    }

    return (
        <div className="main-display-window">
            <button className="main-display-window-button"
                onClick={backwardClick}>◀</button>
            {nowDisplaying.pageOneSource !== '' ?
                (
                    <div className="double-page">
                        <img className="main-display-1"
                            alt="Currently displayed previous page."
                            src={nowDisplaying.pageOneSource}
                            key={nowDisplaying.pageOneSource} 
                            title="Tip: You can use arrow keys to navigate" />
                        <img className="main-display-2"
                            alt="Currently displayed next page."
                            src={nowDisplaying.pageTwoSource}
                            key={nowDisplaying.pageTwoSource} 
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
        setCurrentPage,
    }: {
        currentDir: FileNode,
        setCurrentDir: ReactNodeSetter,
        currentPath: FileNode[],
        setCurrentPath: ReactArraySetter,
        setNowDisplaying: ReactPageSetter,
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
        const currentPageInit = 1;
        setCurrentPage(currentPageInit);
        const sourceString = currentPath
            .map(pathNode => pathNode.name)
            .join('/') + "/" + file.name;
        const NewPages: PageObject = {
            pageOneSource: `/api/streamarchive/${sourceString}?Page=${currentPageInit}`,
            pageTwoSource: `/api/streamarchive/${sourceString}?Page=${currentPageInit+1}`,
        }
        setNowDisplaying(NewPages);
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
    const emptyPages = {} as PageObject;
    const [currentDir, setCurrentDir] = useState(emptyNode);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPath, setCurrentPath] = useState<FileNode[]>([]);
    const [nowDisplaying, setNowDisplaying] = useState(emptyPages);
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
            /*const NewPage: PageObject = {
                pageOneSource: nowDisplaying.pageOneSource.replace(`Page=${currentPage}`, `Page=${currentPage + 2}`),
                pageTwoSource: nowDisplaying.pageTwoSource.replace(`Page=${currentPage}`, `Page=${currentPage + 1}`),
            }
            const newDisplay = nowDisplaying.pageOneSource.replace(`Page=${currentPage}`, `Page=${currentPage + 1}`);*/
            const nextPage = currentPage + 2;
            setCurrentPage(nextPage);
            const NewPage = ShiftPage(nowDisplaying, nextPage);
            console.log(NewPage);
            setNowDisplaying(NewPage);
        }

        const backwardClick = async () => {
            /*const NewPage: PageObject = {
                pageOneSource: nowDisplaying.pageOneSource.replace(`Page=${currentPage}`, `Page=${currentPage - 2}`),
                pageTwoSource: nowDisplaying.pageTwoSource.replace(`Page=${currentPage}`, `Page=${currentPage - 1}`),
            }
            const newDisplay = nowDisplaying.replace(`Page=${currentPage}`, `Page=${currentPage - 1}`);*/
            const previousPage = currentPage - 2;
            setCurrentPage(previousPage);
            const NewPage = ShiftPage(nowDisplaying, previousPage);
            console.log(NewPage);
            setNowDisplaying(NewPage);
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
                
                <Sidebar
                    currentDir={currentDir}
                    setCurrentDir={setCurrentDir}
                    currentPath={currentPath}
                    setCurrentPath={setCurrentPath}
                    setNowDisplaying={setNowDisplaying}
                    setCurrentPage={setCurrentPage} />
                <ImageDisplay
                    nowDisplaying={nowDisplaying}
                    setNowDisplaying={setNowDisplaying}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage} />
            </div>
        </>
    );
} 