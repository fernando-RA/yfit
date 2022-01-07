const Spots = (props) => {
    return (
        <form action="">
            <div className="first-row">
                <label htmlFor="">
                    <b>First Name</b>
                    <input type="text" placeholder="First Name" />
                </label>
                <label htmlFor="">
                    <b>Last Name</b>
                    <input type="text" placeholder="Last Name" />
                </label>
            </div>
            <label htmlFor="">
                <b>Email Address</b>
                <input type="text" placeholder="Email Address" />
            </label>
        </form>
    );
};

export default Spots;
