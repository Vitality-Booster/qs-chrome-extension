import "./Website.css"
export const Website = ({ favicon, name, length }: { favicon:string, name: string, length:number }) => {

    const readableLength = (length: number) => {
        const minutes = Math.floor(60 * (length % 1))
        const hours = Math.floor(length)
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
                    <img src={favicon} className="favicon" alt="Website favicon"/>
                    <p style={{margin: 0, marginLeft: "1em"}}>{name}</p>
                </div>
                <div className="top">
                    <div style={{
                        width: "20%"
                    }}>
                        <p style={{margin: 0}}>{readableLength(length)}</p>
                    </div>
                    <div className="bar">
                        <div style={{
                            background: "grey",
                            borderRadius: "5px",
                            height: "100%",
                            width: totalPercentage(length)
                        }}>
                        </div>
                    </div>
                </div>
            </div>
            <hr/>
        </div>
    )
}