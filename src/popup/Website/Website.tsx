import "./Website.css"
import {OverallWebsite} from "../../types/statistics";
export const Website = ({overallWebsite}: { overallWebsite: OverallWebsite }) => {

    const readableLength = (length: number) => {
        // const minutes = Math.floor(60 * (length % 1))
        // const hours = Math.floor(length)
        const minutes = length % 60
        const hours = ~~(length / 60)
        if (hours > 0){
            return hours + "h" + minutes + "m"}
        else{ return minutes + "m" }
    }

    const totalPercentage = (length: number) => {
        return (length / 3.76 * 100) + "%"
    }

    return (
        <div>
            <div className="contents">
                <div className="top">
                    <img src={overallWebsite.favIconUrl} className="favicon" alt="Website favicon"/>
                    <p style={{margin: 0, marginLeft: "1em"}}>{overallWebsite.hostname}</p>
                </div>
                <div className="top">
                    <div style={{
                        width: "20%"
                    }}>
                        <p style={{margin: 0}}>{readableLength(overallWebsite.length)}</p>
                    </div>
                    <div className="bar">
                        <div style={{
                            background: "grey",
                            borderRadius: "5px",
                            height: "100%",
                            width: totalPercentage(overallWebsite.length)
                        }}>
                        </div>
                    </div>
                </div>
            </div>
            <hr/>
        </div>
    )
}