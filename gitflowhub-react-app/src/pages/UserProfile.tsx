import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthProvider';
import axiosClient from '../config/axiosClient';

interface Company {
  id: number;
  name: string;
}

interface User {
  id: number;
  email: string;
  username: string;
  token: string;
  confirmed: boolean;
  location: string;
  language: string;
  timeZone: string;
  image: string;
  github_user: string;
  login: string;
  avatar_url: string;
  company_id: number | null;
  Company?: Company;
}

const UserProfile: React.FC = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const [user, setUser] = useState<User | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserDataAndCompanies = async () => {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const [userDataResponse, companiesResponse] = await Promise.all([
          axiosClient.get<User>(`/${auth.github_user}`, config),
          axiosClient.get<Company[]>('/companies', config),
        ]);

        console.log(`Fetch User Data Response: ${JSON.stringify(userDataResponse.data)}`);
        console.log(`Fetch Companies Response: ${JSON.stringify(companiesResponse.data)}`);

        setUser(userDataResponse.data);
        setSelectedCompanyId(userDataResponse.data.company_id);
        setCompanies(companiesResponse.data);

      } catch (error) {
        console.error(`Error fetching user data and companies: ${error.message}`);
        if (error.response) {
          console.error(`Response status: ${error.response.status}`);
          console.error(`Response data: ${JSON.stringify(error.response.data)}`);
        }
      }
    };

    fetchUserDataAndCompanies();
  }, [auth.github_user]);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`handleUsernameChange called with value: ${event.target.value}`);
    setUser({
      ...user!,
      username: event.target.value,
    });
  };

  const handleCompanyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(`handleCompanyChange called with value: ${event.target.value}`);
    setSelectedCompanyId(Number(event.target.value));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log(`handleSubmit called with github_user: ${user?.github_user}, selectedCompanyId: ${selectedCompanyId}`);
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axiosClient.put(`/${user?.github_user}`, { company_id: selectedCompanyId, username: user?.username }, config);
      console.log(`Update Profile Response: ${JSON.stringify(response.data)}`);
      setUser(response.data);
    } catch (error) {
      console.error(`Error updating profile: ${error.message}`);
      if (error.response) {
        console.error(`Response status: ${error.response.status}`);
        console.error(`Response data: ${JSON.stringify(error.response.data)}`);
      }
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" name="email" value={user.email} readOnly />
        </label>
        <label>
          Username:
          <input type="text" name="username" value={user.username} onChange={handleUsernameChange} />
        </label>
        <label>
          Avatar URL:
          <img src={user.avatar_url} alt="User avatar" style={{ width: '100px', height: '100px' }} />
        </label>
        <label>
          Github User:
          <input type="text" name="github_user" value={user.github_user} readOnly />
        </label>
        <label>
          Company:
          <select value={selectedCompanyId ?? ''} onChange={handleCompanyChange}>
            <option value="">Select company</option>
            {companies.map(company => (
              <option key={company.id} value={company.id}>{company.name}</option>
            ))}
          </select>
        </label>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default UserProfile;
