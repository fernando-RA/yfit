import { makeStyles, withStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
}));

const Form = () => {
    const classes = useStyles();

    return (
        <form
            className={"checkout-form-container"}
            noValidate
            autoComplete="off"
        >
            <div className="contact-info">
                <h5 className="contact-title">contact info</h5>
                <h5 className="contact-description">
                    Continue as guest or <a href="">Log in</a> for quick
                    checkout
                </h5>
            </div>
            <div className="first-row">
                <label htmlFor="">
                    <b>First Name</b>

                    <input id="name" placeholder="First Name" />
                </label>
                <label htmlFor="">
                    <b>Last Name</b>
                    <input id="surname" placeholder="Last Name" />
                </label>
            </div>
            <label htmlFor="">
                <b>Email Address</b>
                <input id="outlined-basic" placeholder="Email Address" />
            </label>
            <label htmlFor="">
                <b>Confirm Email Address</b>
                <input
                    id="outlined-basic"
                    placeholder="Confirm Email address"
                />
            </label>
            <label htmlFor="">
                <b>Phone Number (optional)</b>
                <input
                    id="outlined-basic"
                    placeholder="Phone Number (optional)"
                />
            </label>
            <p className="phone-number-alert">
                This will be used for class reminders only, not spam!
            </p>
        </form>
    );
};
export default Form;
