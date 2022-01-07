import React from "react";
import Link from "next/link";

import TempFooter from "../components/TempFooter";

import { Navbar, CONTAINER_CLASSNAME } from "../components/Navbar";

export const LinkTable = () => {
    const currentRoute = "privacy-policy";
    return (
        <>
            {[
                "What information do we collect?",
                "How do we use your information?",
                "Will your information be shared with anyone?",
                "Do we use cookies and other tracking technologies?",
                "Do we use google maps?",
                "How do we handle your social logins?",
                "How long do we keep your information?",
                "How do we keep your information safe?",
                "Do we collect information from minors?",
                "What are your privacy rights?",
                "Controls for do-not-track features",
                "Do california residents have specific privacy rights?",
                "Do we make updates to this notice?",
                "How can you contact us about this notice?",
            ].map((e, i) => (
                <Link href={`/${currentRoute}#${i + 1}`} key={e}>
                    <a
                        href={`/${currentRoute}#${i + 1}`}
                        className="mt-2 uppercase"
                    >{`${i + 1}. ${e}`}</a>
                </Link>
            ))}
        </>
    );
};

const PrivacyPolicy = () => {
    const currentRoute = "privacy-policy";
    return (
        <div className="wrapper">
            <Navbar />
            <div className={`${CONTAINER_CLASSNAME} privacy-policy`}>
                <div className="content max-w-4xl">
                    <div className="py-10">
                        <ol className="text-bold uppercase">
                            <li>
                                <a href="#privacy-policy">I. Privacy Policy</a>
                            </li>
                            <li>
                                <a href="#conditions-of-use">
                                    II. Conditions of use
                                </a>
                            </li>
                            <li>
                                <a href="#photo-release">III. Photo Release</a>
                            </li>
                        </ol>
                    </div>
                    <p className="text-bold uppercase" id="privacy-policy">
                        I. Privacy policy
                    </p>
                    <p className="text-bold">Last updated Oct 6, 2021</p>
                    <p>
                        Thank you for choosing to be part of our community at
                        Undercard Technologies, Inc., doing business as Rec (
                        <strong>&ldquo;Rec&rdquo;,</strong>
                        <strong>&ldquo;we&rdquo;,</strong>
                        <strong>&ldquo;us&rdquo;, </strong>
                        or
                        <strong> &ldquo;our&rdquo;</strong> ). We are committed
                        to protecting your personal information and your right
                        to privacy. If you have any questions or concerns about
                        this privacy notice, or our practices with regards to
                        your personal information, please contact us at
                        hi@getrec.com.
                    </p>
                    <p>
                        When you use our mobile application, as the case may be
                        (the
                        <strong>&quot;App&quot;</strong>) and more generally,
                        use any of our services (the{" "}
                        <strong>&quot;Services&quot;</strong>, which include the
                        App), we appreciate that you are trusting us with your
                        personal information. We take your privacy very
                        seriously. In this privacy notice, we seek to explain to
                        you in the clearest way possible what information we
                        collect, how we use it and what rights you have in
                        relation to it. We hope you take some time to read
                        through it carefully, as it is important. If there are
                        any terms in this privacy notice that you do not agree
                        with, please discontinue use of our Services
                        immediately.
                    </p>
                    <p>
                        This privacy notice applies to all information collected
                        through our Services (which, as described above,
                        includes our App), as well as any related services,
                        sales, marketing or events.
                    </p>
                    <p>
                        <strong>
                            Please read this privacy notice carefully as it will
                            help you understand what we do with the information
                            that we collect.
                        </strong>
                    </p>
                    <p className="table mt-6">
                        <strong>Table of contents</strong>
                        <LinkTable />
                    </p>
                    <>
                        <p className="mt-6" id="1">
                            <strong>1. WHAT INFORMATION DO WE COLLECT?</strong>
                        </p>
                        <p className="mt-5">
                            <strong>
                                Personal information you disclose to us
                            </strong>
                        </p>
                        <p>
                            <strong>In Short: </strong>We collect information
                            that you provide to us.
                        </p>
                        <p>
                            We collect personal information that you voluntarily
                            provide to us when you register on the App, express
                            an interest in obtaining information about us or our
                            products and Services, when you participate in
                            activities on the App (such as by posting messages
                            in our online forums or entering competitions,
                            contests or giveaways) or otherwise when you contact
                            us.
                        </p>
                        <p>
                            The personal information that we collect depends on
                            the context of your interactions with us and the
                            App, the choices you make and the products and
                            features you use. The personal information we
                            collect may include the following:
                        </p>
                        <p>
                            <strong>
                                Personal Information Provided by You.
                            </strong>
                            &nbsp;We collect&nbsp;names;&nbsp;email
                            addresses;&nbsp;debit/credit card
                            numbers;&nbsp;billing addresses;&nbsp;and other
                            similar information.
                        </p>
                        <p>
                            <strong>Payment Data.&nbsp;</strong>We may collect
                            data necessary to process your payment if you make
                            purchases, such as your payment instrument number
                            (such as a credit card number), and the security
                            code associated with your payment instrument. All
                            payment data is stored by&nbsp;Stripe. You may find
                            their privacy notice link(s) here:&nbsp;
                            <a
                                href="https://stripe.com/privacy"
                                target="_blank"
                                rel="noreferrer"
                            >
                                https://stripe.com/privacy
                            </a>
                            .
                        </p>
                        <p>
                            <strong>Social Media Login Data.</strong>&nbsp;We
                            may provide you with the option to register with us
                            using your existing social media account details,
                            like your Facebook, Twitter or other social media
                            account. If you choose to register in this way, we
                            will collect the information described in the
                            section called &quot;
                            <Link href="/privacy-policy#sociallogins">
                                HOW DO WE HANDLE YOUR SOCIAL LOGINS
                            </Link>
                            &quot; below.
                        </p>
                        <p>
                            All personal information that you provide to us must
                            be true, complete and accurate, and you must notify
                            us of any changes to such personal information.
                        </p>

                        <p className="mt-6">
                            <strong>
                                Information collected through our App
                            </strong>
                        </p>
                        <em>
                            We collect information regarding
                            your&nbsp;geo-location,&nbsp;mobile
                            device,&nbsp;push notifications,&nbsp;when you use
                            our App.
                        </em>

                        <p>
                            If you use our App, we also collect the following
                            information:
                        </p>

                        <ul>
                            <li>
                                <p>
                                    <em>Geo-Location Information.</em>&nbsp;We
                                    may request access or permission to and
                                    track location-based information from your
                                    mobile device, either continuously or while
                                    you are using our App, to provide certain
                                    location-based services. If you wish to
                                    change our access or permissions, you may do
                                    so in your device&apos;s settings.
                                </p>
                            </li>
                        </ul>

                        <ul>
                            <li>
                                <p>
                                    <em>Mobile Device Access.&nbsp;</em>We may
                                    request access or permission to certain
                                    features from your mobile device, including
                                    your mobile
                                    device&apos;s&nbsp;calendar,&nbsp;and other
                                    features. If you wish to change our access
                                    or permissions, you may do so in your
                                    device&apos;s settings.
                                </p>
                            </li>
                        </ul>

                        <ul>
                            <li>
                                <p>
                                    <em>Push Notifications.&nbsp;</em>We may
                                    request to send you push notifications
                                    regarding your account or certain features
                                    of the App. If you wish to opt-out from
                                    receiving these types of communications, you
                                    may turn them off in your device&apos;s
                                    settings.
                                </p>
                            </li>
                        </ul>
                        <p>
                            The information is primarily needed to maintain the
                            security and operation of our App, for
                            troubleshooting and for our internal analytics and
                            reporting purposes.
                        </p>
                    </>
                    <>
                        <p className="mt-6" id="2">
                            <strong>2. HOW DO WE USE YOUR INFORMATION?</strong>
                        </p>
                        <p>
                            <strong>
                                <em>In Short: &nbsp;</em>
                            </strong>
                            <em>
                                We process your information for purposes based
                                on legitimate business interests, the
                                fulfillment of our contract with you, compliance
                                with our legal obligations, and/or your consent.
                            </em>
                        </p>
                        <p>
                            We use personal information collected via
                            our&nbsp;App&nbsp;for a variety of business purposes
                            described below. We process your personal
                            information for these purposes in reliance on our
                            legitimate business interests, in order to enter
                            into or perform a contract with you, with your
                            consent, and/or for compliance with our legal
                            obligations. We indicate the specific processing
                            grounds we rely on next to each purpose listed
                            below.
                        </p>
                        <p>We use the information we collect or receive:</p>
                        <ul>
                            <li>
                                <p>
                                    <strong>
                                        To facilitate account creation and logon
                                        process.
                                    </strong>
                                    &nbsp;If you choose to link your account
                                    with us to a third-party account (such as
                                    your Google or Facebook account), we use the
                                    information you allowed us to collect from
                                    those third parties to facilitate account
                                    creation and logon process for the
                                    performance of the contract.&nbsp;See the
                                    section below headed &quot;
                                    <Link href={`/${currentRoute}#6`}>
                                        <a href={`/${currentRoute}#6`}>
                                            HOW DO WE HANDLE YOUR SOCIAL LOGINS
                                        </a>
                                    </Link>
                                    &quot; for further information.
                                </p>
                            </li>
                            <li>
                                <p>
                                    <strong>To post testimonials.</strong>
                                    &nbsp;We post testimonials on
                                    our&nbsp;App&nbsp;that may contain personal
                                    information. Prior to posting a testimonial,
                                    we will obtain your consent to use your name
                                    and the consent of the testimonial. If you
                                    wish to update, or delete your testimonial,
                                    please contact us at&nbsp;hi@getrec.com
                                    &nbsp;and be sure to include your name,
                                    testimonial location, and contact
                                    information.
                                </p>
                            </li>
                            <li>
                                <p>
                                    <strong>Request feedback.</strong>&nbsp;We
                                    may use your information to request feedback
                                    and to contact you about your use of
                                    our&nbsp;App.
                                </p>
                            </li>
                            <li>
                                <p>
                                    <strong>
                                        To enable user-to-user communications.
                                    </strong>
                                    &nbsp;We may use your information in order
                                    to enable user-to-user communications with
                                    each user&apos;s consent.
                                </p>
                            </li>
                            <li>
                                <p>
                                    <strong>To manage user accounts</strong>. We
                                    may use your information for the purposes of
                                    managing our account and keeping it in
                                    working order.
                                </p>
                            </li>
                        </ul>
                        <ul className="mt-6">
                            <li>
                                <p>
                                    <strong>
                                        Fulfill and manage your orders.
                                    </strong>
                                    &nbsp;We may use your information to fulfill
                                    and manage your orders, payments, returns,
                                    and exchanges made through the&nbsp;App.
                                </p>
                            </li>
                            <li>
                                <p>
                                    <strong>
                                        Administer prize draws and
                                        competitions.&nbsp;
                                    </strong>
                                    We may use your information to administer
                                    prize draws and competitions when you elect
                                    to participate in our competitions.
                                </p>
                            </li>
                            <li>
                                <p>
                                    <strong>
                                        To deliver and facilitate delivery of
                                        services to the user.
                                    </strong>
                                    &nbsp;We may use your information to provide
                                    you with the requested service.
                                </p>
                            </li>
                            <li>
                                <p>
                                    <strong>
                                        To respond to user inquiries/offer
                                        support to users.
                                    </strong>
                                    &nbsp;We may use your information to respond
                                    to your inquiries and solve any potential
                                    issues you might have with the use of our
                                    Services.
                                </p>
                            </li>
                        </ul>
                        <ul className="mt-6">
                            <li>
                                <p>
                                    <strong>
                                        To send you marketing and promotional
                                        communications.
                                    </strong>
                                    &nbsp;We and/or our third-party marketing
                                    partners may use the personal information
                                    you send to us for our marketing purposes,
                                    if this is in accordance with your marketing
                                    preferences. For example, when expressing an
                                    interest in obtaining information about us
                                    or our&nbsp;App, subscribing to marketing or
                                    otherwise contacting us, we will collect
                                    personal information from you. You can
                                    opt-out of our marketing emails at any time
                                    (see the &quot;
                                    <Link href={`/${currentRoute}#10`}>
                                        <a href={`/${currentRoute}#6`}>
                                            WHAT ARE YOUR PRIVACY RIGHTS
                                        </a>
                                    </Link>
                                    &quot; below).
                                </p>
                            </li>
                            <li>
                                <p>
                                    <strong>
                                        Deliver targeted advertising to
                                        you.&nbsp;
                                    </strong>
                                    We may use your information to develop and
                                    display personalized content and advertising
                                    (and work with third parties who do so)
                                    tailored to your interests and/or location
                                    and to measure its effectiveness.
                                </p>
                            </li>
                        </ul>
                    </>
                    <>
                        <p className="mt-6" id="3">
                            <strong>
                                3. WILL YOUR INFORMATION BE SHARED WITH ANYONE?
                            </strong>
                        </p>
                        <p>
                            <strong>
                                <em>In Short:&nbsp;</em>&nbsp;
                            </strong>
                            <em>
                                We only share information with your consent, to
                                comply with laws, to provide you with services,
                                to protect your rights, or to fulfill business
                                obligations.
                            </em>
                        </p>
                        <p>
                            We may process or share your data that we hold based
                            on the following legal basis:
                        </p>

                        <ul>
                            <li>
                                <p>
                                    <strong>Consent:</strong>&nbsp;We may
                                    process your data if you have given us
                                    specific consent to use your personal
                                    information in a specific purpose.
                                </p>
                            </li>
                            <li>
                                <p>
                                    <strong>Legitimate Interests:</strong>
                                    &nbsp;We may process your data when it is
                                    reasonably necessary to achieve our
                                    legitimate business interests.
                                </p>
                            </li>
                            <li>
                                <p>
                                    <strong>
                                        Performance of a Contract:&nbsp;
                                    </strong>
                                    Where we have entered into a contract with
                                    you, we may process your personal
                                    information to fulfill the terms of our
                                    contract.
                                </p>
                            </li>
                            <li>
                                <p>
                                    <strong>Legal Obligations:</strong>&nbsp;We
                                    may disclose your information where we are
                                    legally required to do so in order to comply
                                    with applicable law, governmental requests,
                                    a judicial proceeding, court order, or legal
                                    process, such as in response to a court
                                    order or a subpoena (including in response
                                    to public authorities to meet national
                                    security or law enforcement requirements).
                                </p>
                            </li>
                            <li>
                                <p>
                                    <strong>Vital Interests:</strong>&nbsp;We
                                    may disclose your information where we
                                    believe it is necessary to investigate,
                                    prevent, or take action regarding potential
                                    violations of our policies, suspected fraud,
                                    situations involving potential threats to
                                    the safety of any person and illegal
                                    activities, or as evidence in litigation in
                                    which we are involved.
                                </p>
                            </li>
                        </ul>
                        <p>
                            More specifically, we may need to process your data
                            or share your personal information in the following
                            situations:
                        </p>
                        <ul>
                            <li>
                                <p>
                                    <strong>Business Transfers.</strong>&nbsp;We
                                    may share or transfer your information in
                                    connection with, or during negotiations of,
                                    any merger, sale of company assets,
                                    financing, or acquisition of all or a
                                    portion of our business to another company.
                                </p>
                            </li>
                        </ul>
                        <ul>
                            <li>
                                <p>
                                    <strong>Other Users.</strong>&nbsp;When you
                                    share personal information&nbsp;(for
                                    example, by posting comments, contributions
                                    or other content to the&nbsp;App)&nbsp;or
                                    otherwise interact with public areas of
                                    the&nbsp;App, such personal information may
                                    be viewed by all users and may be publicly
                                    made available outside the&nbsp;App&nbsp;in
                                    perpetuity.&nbsp;If you interact with other
                                    users of our&nbsp;App&nbsp;and register for
                                    our&nbsp;App&nbsp;through a social network
                                    (such as Facebook), your contacts on the
                                    social network will see your name, profile
                                    photo, and descriptions of your
                                    activity.&nbsp;Similarly, other users will
                                    be able to view descriptions of your
                                    activity, communicate with you within
                                    our&nbsp;App, and view your profile.
                                </p>
                            </li>
                        </ul>
                    </>
                    <>
                        <p className="mt-6" id="4">
                            <strong>
                                4. DO WE USE COOKIES AND OTHER TRACKING
                                TECHNOLOGIES?
                            </strong>
                        </p>
                        <p>
                            <strong>
                                <em>In Short:&nbsp;</em>&nbsp;
                            </strong>
                            <em>
                                We may use cookies and other tracking
                                technologies to collect and store your
                                information.
                            </em>
                        </p>
                        <p>
                            We may use cookies and similar tracking technologies
                            (like web beacons and pixels) to access or store
                            information. Specific information about how we use
                            such technologies and how you can refuse certain
                            cookies is set out in our Cookie Notice.
                        </p>
                    </>

                    <>
                        <p className="mt-6" id="5">
                            <strong>5. DO WE USE GOOGLE MAPS?</strong>
                        </p>
                        <p>
                            <strong>
                                <em>In Short:&nbsp;</em>&nbsp;
                            </strong>
                            <em>
                                Yes, we use Google Maps for the purpose of
                                providing better service.
                            </em>
                        </p>
                        <p>
                            This&nbsp;App&nbsp;uses Google Maps APIs which is
                            subject to Google&apos;s Terms of Service. You may
                            find the Google Maps APIs Terms of Service&nbsp;
                            <a
                                href="https://developers.google.com/maps/terms"
                                target="_blank"
                                rel="noreferrer"
                            >
                                here
                            </a>
                            . To find out more about Google’s Privacy Policy,
                            please refer to this&nbsp;
                            <a
                                href="https://policies.google.com/privacy"
                                target="_blank"
                                rel="noreferrer"
                            >
                                link
                            </a>
                            .&nbsp;We obtain and store on your device
                            (&apos;cache&apos;) your location. You may revoke
                            your consent anytime by contacting us at the contact
                            details provided at the end of this document.
                        </p>
                    </>
                    <>
                        <p className="mt-6" id="6">
                            <strong>
                                6. HOW DO WE HANDLE YOUR SOCIAL LOGINS?
                            </strong>
                        </p>
                        <p>
                            <strong>
                                <em>In Short:&nbsp;</em>&nbsp;
                            </strong>
                            <em>
                                If you choose to register or log in to our
                                services using a social media account, we may
                                have access to certain information about you.
                            </em>
                        </p>
                        <p>
                            Our App offers you the ability to register and login
                            using your third-party social media account details
                            (like your Facebook or Twitter logins). Where you
                            choose to do this, we will receive certain profile
                            information about you from your social media
                            provider. The profile Information we receive may
                            vary depending on the social media provider
                            concerned, but will often include your name, email
                            address, friends list, profile picture as well as
                            other information you choose to make public on such
                            social media platform.
                        </p>
                        <p>
                            We will use the information we receive only for the
                            purposes that are described in this privacy notice
                            or that are otherwise made clear to you on the
                            relevant App. Please note that we do not control,
                            and are not responsible for, other uses of your
                            personal information by your third-party social
                            media provider. We recommend that you review their
                            privacy notice to understand how they collect, use
                            and share your personal information, and how you can
                            set your privacy preferences on their sites and
                            apps.
                        </p>
                    </>
                    <>
                        <p className="mt-6" id="7">
                            <strong>
                                7. HOW LONG DO WE KEEP YOUR INFORMATION?
                            </strong>
                        </p>
                        <p>
                            <strong>
                                <em>In Short:&nbsp;</em>&nbsp;
                            </strong>
                            <em>
                                We keep your information for as long as
                                necessary to fulfill the purposes outlined in
                                this privacy notice&nbsp;unless otherwise
                                required by law.
                            </em>
                        </p>
                        <p>
                            We will only keep your personal information for as
                            long as it is necessary for the purposes set out in
                            this privacy notice, unless a longer retention
                            period is required or permitted by law (such as tax,
                            accounting or other legal requirements). No purpose
                            in this notice will require us keeping your personal
                            information for longer than the period of time in
                            which users have an account with us.
                        </p>
                        <p>
                            When we have no ongoing legitimate business need to
                            process your personal information, we will either
                            delete or anonymize such information, or, if this is
                            not possible (for example, because your personal
                            information has been stored in backup archives),
                            then we will securely store your personal
                            information and isolate it from any further
                            processing until deletion is possible.
                        </p>
                    </>
                    <>
                        <p className="mt-6" id="8">
                            <strong>
                                8. HOW DO WE KEEP YOUR INFORMATION SAFE?
                            </strong>
                        </p>
                        <p>
                            <strong>
                                <em>In Short:&nbsp;</em>&nbsp;
                            </strong>
                            <em>
                                We aim to protect your personal information
                                through a system of organizational and technical
                                security measures.
                            </em>
                        </p>
                        <p>
                            We have implemented appropriate technical and
                            organizational security measures designed to protect
                            the security of any personal information we process.
                            However, despite our safeguards and efforts to
                            secure your information, no electronic transmission
                            over the Internet or information storage technology
                            can be guaranteed to be 100% secure, so we cannot
                            promise or guarantee that hackers, cybercriminals,
                            or other unauthorized third parties will not be able
                            to defeat our security, and improperly collect,
                            access, steal, or modify your information. Although
                            we will do our best to protect your personal
                            information, transmission of personal information to
                            and from our App is at your own risk. You should
                            only access the App within a secure environment.
                        </p>
                    </>
                    <>
                        <p className="mt-6" id="9">
                            <strong>
                                9. DO WE COLLECT INFORMATION FROM MINORS?
                            </strong>
                        </p>
                        <p>
                            <strong>
                                <em>In Short:&nbsp;</em>&nbsp;
                            </strong>
                            <em>
                                We do not knowingly collect data from or market
                                to children under 18 years of age.
                            </em>
                        </p>
                        <p>
                            We do not knowingly solicit data from or market to
                            children under 18 years of age. By using the App,
                            you represent that you are at least 18 or that you
                            are the parent or guardian of such a minor and
                            consent to such minor dependent’s use of the App. If
                            we learn that personal information from users less
                            than 18 years of age has been collected, we will
                            deactivate the account and take reasonable measures
                            to promptly delete such data from our records. If
                            you become aware of any data we may have collected
                            from children under age 18, please contact us at
                            hi@getrec.com.
                        </p>
                    </>

                    <>
                        <p className="mt-6" id="10">
                            <strong>10. WHAT ARE YOUR PRIVACY RIGHTS?</strong>
                        </p>
                        <p>
                            <strong>
                                <em>In Short:&nbsp;</em>&nbsp;
                            </strong>
                            <em>
                                In some regions, such as the European Economic
                                Area, you have rights that allow you greater
                                access to and control over your personal
                                information.&nbsp;You may review, change, or
                                terminate your account at any time.
                            </em>
                        </p>
                        <p>
                            In some regions (like the European Economic Area),
                            you have certain rights under applicable data
                            protection laws. These may include the right (i) to
                            request access and obtain a copy of your personal
                            information, (ii) to request rectification or
                            erasure; (iii) to restrict the processing of your
                            personal information; and (iv) if applicable, to
                            data portability. In certain circumstances, you may
                            also have the right to object to the processing of
                            your personal information. To make such a request,
                            please use the&nbsp;
                            <Link href="/contact-us">
                                <a>contact details</a>
                            </Link>
                            &nbsp;provided below. We will consider and act upon
                            any request in accordance with applicable data
                            protection laws.
                        </p>
                        <p>
                            If we are relying on your consent to process your
                            personal information, you have the right to withdraw
                            your consent at any time. Please note however that
                            this will not affect the lawfulness of the
                            processing before its withdrawal, nor will it affect
                            the processing of your personal information
                            conducted in reliance on lawful processing grounds
                            other than consent.
                        </p>
                        <p>
                            If you are resident in the European Economic Area
                            and you believe we are unlawfully processing your
                            personal information, you also have the right to
                            complain to your local data protection supervisory
                            authority. You can find their contact details
                            here:&nbsp;
                            <a
                                href="http://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <span>
                                    http://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm
                                </span>
                            </a>
                            .
                        </p>
                        <p>
                            If you are resident in Switzerland, the contact
                            details for the data protection authorities are
                            available here:&nbsp;
                            <a
                                href="https://www.edoeb.admin.ch/edoeb/en/home.html"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <span>
                                    https://www.edoeb.admin.ch/edoeb/en/home.html
                                </span>
                            </a>
                            .
                        </p>
                        <p className="mt-6">
                            If you have questions or comments about your privacy
                            rights, you may email us at hi@getrec.com.
                        </p>
                        <p>
                            <strong>Account Information</strong>
                        </p>
                        <p>
                            If you would at any time like to review or change
                            the information in your account or terminate your
                            account, you can:
                        </p>
                        <p>
                            &nbsp; &nbsp; ■ &nbsp;Contact us using the contact
                            information provided.
                        </p>
                        <p>
                            &nbsp; &nbsp; ■ &nbsp;Log in to your account
                            settings and update your user account.
                        </p>
                        <p>
                            Upon your request to terminate your account, we will
                            deactivate or delete your account and information
                            from our active databases. However, we may retain
                            some information in our files to prevent fraud,
                            troubleshoot problems, assist with any
                            investigations, enforce our Terms of Use and/or
                            comply with applicable legal requirements.
                        </p>
                        <p>
                            <span style={{ textDecoration: "underline" }}>
                                <strong>Opting out of email marketing:</strong>
                            </span>
                            <strong>&nbsp;</strong>You can unsubscribe from our
                            marketing email list at any time by clicking on the
                            unsubscribe link in the emails that we send or by
                            contacting us using the details provided below. You
                            will then be removed from the marketing email list –
                            however, we may still communicate with you, for
                            example to send you service-related emails that are
                            necessary for the administration and use of your
                            account, to respond to service requests, or for
                            other non-marketing purposes. To otherwise opt-out,
                            you may:
                        </p>
                        <p>
                            &nbsp; &nbsp; ■&nbsp;&nbsp;Contact us using the
                            contact information provided.
                        </p>
                    </>
                    <>
                        <p className="mt-6" id="11">
                            <strong>
                                11. CONTROLS FOR DO-NOT-TRACK FEATURES
                            </strong>
                        </p>
                        <p>
                            Most web browsers and some mobile operating systems
                            and mobile applications include a Do-Not-Track
                            (DNT&rdquo;) feature or setting you can activate to
                            signal your privacy preference not to have data
                            about your online browsing activities monitored and
                            collected. At this stage, no uniform technology
                            standard for recognizing and implementing DNT
                            signals has been finalized. As such, we do not
                            currently respond to DNT browser signals or any
                            other mechanism that automatically communicates your
                            choice not to be tracked online. If a standard for
                            online tracking is adopted that we must follow in
                            the future, we will inform you about that practice
                            in a revised version of this privacy notice.
                        </p>
                    </>
                    <>
                        <p className="mt-6" id="12">
                            <strong>
                                12. DO CALIFORNIA RESIDENTS HAVE SPECIFIC
                                PRIVACY RIGHTS?
                            </strong>
                        </p>
                        <p>
                            <strong>
                                <em>In Short:&nbsp;</em>&nbsp;
                            </strong>
                            <em>
                                Yes, if you are a resident of California, you
                                are granted specific rights regarding access to
                                your personal information.
                            </em>
                        </p>
                        <p>
                            California Civil Code Section 1798.83, also known as
                            the &ldquo;Shine The Light&rdquo; law, permits our
                            users who are California residents to request and
                            obtain from us, once a year and free of charge,
                            information about categories of personal information
                            (if any) we disclosed to third parties for direct
                            marketing purposes and the names and addresses of
                            all third parties with which we shared personal
                            information in the immediately preceding calendar
                            year. If you are a California resident and would
                            like to make such a request, please submit your
                            request in writing to us using the contact
                            information provided below.
                        </p>
                        <p>
                            If you are under 18 years of age, reside in
                            California, and have a registered account with the
                            App, you have the right to request removal of
                            unwanted data that you publicly post on the App. To
                            request removal of such data, please contact us
                            using the contact information provided below, and
                            include the email address associated with your
                            account and a statement that you reside in
                            California. We will make sure the data is not
                            publicly displayed on the App, but please be aware
                            that the data may not be completely or
                            comprehensively removed from all our systems (e.g.
                            backups, etc.).
                        </p>
                    </>

                    <>
                        <p className="mt-6" id="13">
                            <strong>
                                13. DO WE MAKE UPDATES TO THIS NOTICE?
                            </strong>
                        </p>
                        <p>
                            <strong>
                                <em>In Short:&nbsp;</em>&nbsp;
                            </strong>
                            <em>
                                Yes, we will update this notice as necessary to
                                stay compliant with relevant laws.
                            </em>
                        </p>
                        <p>
                            We may update this privacy notice from time to time.
                            The updated version will be indicated by an updated
                            &ldquo;Revised&rdquo; date and the updated version
                            will be effective as soon as it is accessible. If we
                            make material changes to this privacy notice, we may
                            notify you either by prominently posting a notice of
                            such changes or by directly sending you a
                            notification. We encourage you to review this
                            privacy notice frequently to be informed of how we
                            are protecting your information.
                        </p>
                    </>
                    <>
                        <p className="mt-6" id="14">
                            <strong>
                                14. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
                            </strong>
                        </p>
                        <p>
                            If you have questions or comments about this notice,
                            you may email us at hi@getrec.com or by post to:
                        </p>
                        <p>Undercard Technologies, Inc.</p>
                        <p>651 N Broad St.</p>
                        <p>Suite 206</p>
                        <p>Middletown, DE 19709</p>
                    </>

                    <>
                        <>
                            <p className="mt-6" id="15">
                                <strong>
                                    HOW CAN YOU REVIEW, UPDATE, OR DELETE THE
                                    DATA WE COLLECT FROM YOU?
                                </strong>
                            </p>
                            <p>
                                Based on the applicable laws of your country,
                                you may have the right to request access to the
                                personal information we collect from you, change
                                that information, or delete it in some
                                circumstances. To request to review, update, or
                                delete your personal information,
                                please&nbsp;submit a request form by
                                clicking&nbsp;
                                <a
                                    href="https://app.termly.io/notify/f42f643c-7627-4811-b17a-fc982e8ced42"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    here
                                </a>
                                . We will respond to your request within 30
                                days.
                            </p>
                            <p>
                                This privacy policy was created using&nbsp;
                                <a href="https://termly.io/products/privacy-policy-generator/?ftseo">
                                    Termly’s Privacy Policy Generator
                                </a>
                                .
                            </p>
                        </>
                    </>
                    <p
                        className="mt-6 font-bold uppercase"
                        id="conditions-of-use"
                    >
                        II. Conditions of use and release of liability
                    </p>
                    <p>
                        Undercard Technologies, Inc., together with its
                        subsidiaries, successors, and assigns (the &ldquo;
                        <strong>Company</strong>&rdquo;) makes no warranties
                        whatsoever regarding the condition of the gymnasiums or
                        other spaces (each a &ldquo;<strong>Space</strong>
                        &rdquo;) used for fitness sessions or other events (each
                        an &ldquo;
                        <strong>Event</strong>&rdquo;). You acknowledge you have
                        inspected the Space and found it suitable for your
                        purposes. The Company shall not be liable for any
                        personal injury or damage to property which you or your
                        guests or invitees may incur, regardless of the cause
                        thereof. You hereby release the Company from all such
                        liability, it being the intent of the parties that you
                        shall maintain adequate insurance to cover any such
                        losses. You hereby agree to defend, indemnify and hold
                        harmless the Company, its directors, officers,
                        employees, and agents from and against any and all
                        claims, damages, losses, suits, judgments, costs and
                        expenses arising from your occupation of the Space
                        including, but not limited to, any claim made by your
                        invitee or other person who attends an Event, the
                        amounts of deductibles on your insurance policies, or
                        any costs resulting from your failure to acquire
                        insurance coverage as required hereunder, and any costs
                        arising from subrogation under worker’s compensation or
                        liability claims.
                    </p>
                    <p className="mt-6 font-bold uppercase" id="photo-release">
                        III. Photo release
                    </p>
                    <p>
                        For good and valuable consideration, the receipt of
                        which is hereby acknowledged, I hereby grant Undercard
                        Technologies, Inc., together with its subsidiaries,
                        successors, and assigns (the &ldquo;
                        <strong>Company</strong>
                        &rdquo;), permission to use my likeness in a photograph
                        in any and all of its publications, including but not
                        limited to all of the Company’s printed and digital
                        publications. I understand and agree that any photograph
                        using my likeness will become property of the Company
                        and will not be returned.
                    </p>
                    <p>
                        I acknowledge that since my participation with the
                        Company is voluntary, I will receive no financial
                        compensation.
                    </p>
                    <p>
                        I hereby irrevocably authorize the Company to edit,
                        alter, copy, exhibit, publish or distribute this
                        photograph for purposes of publicizing the Company’s
                        programs or for any other related, lawful purpose. In
                        addition, I waive the right to inspect or approve the
                        finished product, including written or electronic copy,
                        wherein my likeness appears. Additionally, I waive any
                        right to royalties or other compensation arising or
                        related to the use of the photograph.
                    </p>
                    <p>
                        I hereby hold harmless and release and forever discharge
                        the Company from any and all claims, demands, and causes
                        of action which I, my heirs, representatives, executors,
                        administrators, or any other persons acting on my behalf
                        or on behalf of my estate have or may have by reason of
                        this authorization.
                    </p>
                </div>
                <div className="mt-20 pb-6">
                    <TempFooter />
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
