

import '../ZahlenErraten.css'

type HostControlsProps = {
    reveal: () => void;
    nextRound: () =>void;
};
function HostControls({reveal, nextRound}: HostControlsProps){

    return(

        <div>
            <button onClick={reveal}>reveal</button>
            <button onClick={() => nextRound()}>nextRound</button>
        </div>
    )
}

export default HostControls;