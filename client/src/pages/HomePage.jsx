const HomePage = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div>
      <h1>Welcome {user ? user.name : 'Guest'}</h1>
      {user && (
        <div>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;