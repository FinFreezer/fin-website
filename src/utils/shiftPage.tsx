interface PageObject {
    pageOneSource: string;
    pageTwoSource: string;
}

export function ShiftPage(Pages: PageObject, newPage: number): PageObject {
    const cutFromIdx = Pages.pageOneSource.indexOf("Page=");
    const cutPageOne: string = Pages.pageOneSource.substring(0, cutFromIdx);
    const cutPageTwo: string = Pages.pageTwoSource.substring(0, cutFromIdx);
    const NewPages: PageObject = {
        pageOneSource: `${cutPageOne}Page=${newPage}`,
        pageTwoSource: `${cutPageTwo}Page=${newPage+1}`
    }
    console.log(NewPages);
    return NewPages
}