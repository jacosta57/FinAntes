function AuthorsBody() {
  return (
    <div
      style={{
        backgroundImage: `url("https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=600")`,
        backgroundSize: "cover",
        height: "100vh",
        margin: "auto",
        border: "solid",
        color: "black",
      }}
    >
      <div className="d-flex flex-column justify-content-center ">
        <div
          style={{
            opacity: "100%",
            backgroundColor: "white",
            borderRadius: "5px",
            padding: "10px",
            margin: "auto",
            marginTop: "20px",
            width: "50%",
            textAlign: "center",
          }}
        >
          <div>
            <h2>Jayson Acosta</h2>
            <p>Jayson04@iastate.edu</p>
          </div>
        </div>
        <div
          style={{
            opacity: "90%",
            backgroundColor: "white",
            borderRadius: "5px",
            padding: "10px",

            margin: "auto",
            marginTop: "20px",
            width: "50%",
            textAlign: "center",
          }}
        >
          <div>
            <h2>Zaid Rachman</h2>
            <p>ZaidR@iastate.edu</p>
          </div>
        </div>
      </div>
    </div> /*#2962FF*/
  );
}
export default AuthorsBody;
