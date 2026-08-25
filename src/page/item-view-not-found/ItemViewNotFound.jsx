import { useNavigate, useParams } from "react-router-dom";
import ItemInformation from "../../Components/item-Information/ItemInformation";
import "./item-view-not-found.css";
import { useEffect } from "react";

function ItemViewNotFound() {
  const navigate = useNavigate();
  const { key } = useParams();

  useEffect(() => {
    setDate();
  }, []);

  const setDate = function () {
    const now = new Date();

    const optionsDate = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const optionsTime = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const formattedDate = new Intl.DateTimeFormat("en-US", optionsDate).format(
      now
    );
    const formattedTime = new Intl.DateTimeFormat("en-US", optionsTime).format(
      now
    );
    const finalOutput = `${formattedDate} — ${formattedTime}`;

    document.querySelector(".page-time").textContent = finalOutput;
  };

  return (
    <div className="page">
      <main className="page-content">
        <h2 className="page-title">Item Information</h2>

        <div className="page-top">
          <a
            className="back-link"
            onClick={() => {
              navigate("/found");
            }}
          >
            &lt;&lt; Back to Post
          </a>
          <p className="page-time">November 5, 2025 — 2:45 PM</p>
        </div>

        <ItemInformation status="not-found" postID={key} />
      </main>
    </div>
  );
}

export default ItemViewNotFound;
