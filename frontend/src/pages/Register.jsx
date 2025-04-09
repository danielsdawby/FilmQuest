import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../stores/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { loading, error } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signup(formData))
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRedirectLogin = () => {
    navigate("/login");
  };

  return (
    <div className="bg-dark">
      <div className="container min-h-[calc(100vh-64px-75px)] flex flex-col items-center justify-center">
        <div className="flex w-full justify-center">
          <div className="w-full max-w-xl items-center bg-dark p-12 py-24 rounded-lg text-white bg-accent">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-400 rounded mb-4"></div>
              <h2 className="text-lg font-semibold">Здравствуйте</h2>
              <p className="text-gray-400">Зарегистрироваться</p>
            </div>
            <form className="mt-6" onSubmit={handleSubmit}>
              <div className="mt-3 flex flex-col items-center justify-center">
                <label className="block w-3/4 text-white">Email</label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Напишите здесь почту"
                  className="w-3/4 p-2 rounded bg-white border border-black text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mt-3 flex flex-col items-center justify-center">
                <label className="block w-3/4 text-white">Пароль</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Напишите здесь пароль"
                  className="w-3/4 p-2 rounded bg-white border border-black text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                className={`block w-3/4 mt-10 mx-auto p-2 rounded font-semibold ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-primary"
                }`}
                disabled={loading}
              >
                {loading ? "Загрузка..." : "Зарегистрироваться"}
              </button>
            </form>
            <p className="mt-4 text-center text-white">
              Уже есть аккаунт?{" "}
              <button onClick={handleRedirectLogin} className="text-blue-500">
                Войти
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
