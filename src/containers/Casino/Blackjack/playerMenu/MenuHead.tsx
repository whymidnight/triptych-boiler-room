interface props {
  username: string;
  credits: number;
  currentPot: number | null;
}

const MenuHead = ({ username, credits, currentPot }: props): JSX.Element => {
  return (
    <div className="MenuHeadComponent card m-4 has-text-centered">
      <div className="card-content">
        <p>
          Credit:{" "}
          <strong>${credits !== null ? credits.toFixed(2) : "0.00"}</strong>
        </p>
      </div>
    </div>
  );
};

export default MenuHead;

