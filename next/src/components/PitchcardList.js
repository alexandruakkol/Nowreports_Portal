import React from 'react'
import "./PitchcardList.css";

const PitchcardList = (props) => {
    const [rows, setRows] = React.useState([]);
    
    function groupCards(children) {
        // group cards_no into smaller arrays, keeping 2 members in one, 3 in the other, 2 in the next, 3 and so on
        const groupedArrays = [];
        let currentIndex = 0;

        while (currentIndex < children.length) {
            let groupSize = currentIndex % 5 < 2 ? 3 : 2; // Alternating between 2 and 3

            if(currentIndex == children.length - 1) { //if at last alone element, add it to the last group
                groupedArrays[groupedArrays.length - 1].push(children[currentIndex]);
                break;
            }

            if (currentIndex + groupSize > children.length) {
                groupSize = children.length - currentIndex; // Adjusting for the last group
            }

            groupedArrays.push(children.slice(currentIndex, currentIndex + groupSize));
            currentIndex += groupSize;
        }

        return groupedArrays;
    }


    React.useEffect(() => {
        const groupedCards = groupCards(props.children);
        setRows(groupedCards);

    }, [props.children]);

  return (
    <div className="pitchcardlist">
        {rows.map((row, ix) => {return <div key={ix} className="pitchcardrow"> 
            {row}
        </div>})}
    </div>
  )
}

export default React.memo(PitchcardList);