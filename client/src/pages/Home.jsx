import React,{useState,useEffect} from 'react'

import { Loader, Card, FormFeild } from '../components';

const RenderCards = ({data,title})=>{
  if(data?.length > 0) return data.map((post) => <Card key={post._id} {...post} />);
  return  <h2 className='mt-5 font-bold text-[#6449ff] text-xl uppercase'>{title}</h2>
}

const Home = () => {
  const [loading, setLoading] = useState(false)
  const [allPosts, setAllPosts] = useState(null)

  const [searchText, setSearchText] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [searchedResults, setSearchedResults] = useState(null)

  useEffect(() =>{
    const fetchPosts = async () => {
      setLoading(true);

      try {
        const response = await fetch('http://localhost:8080/api/v1/post',{
          method:'GET',
          headers:{
            "Content-Type": "application/json",
            },
        })
        if(response.ok){
          const result = await response.json();
          setAllPosts(result.data.reverse());
        }
      } catch (error) {
        alert(error)
      }finally{
        setLoading(false)
      }
    }
    fetchPosts();
  },[]);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = allPosts.filter(
          (item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.prompt.toLowerCase().includes(searchText.toLowerCase())
        );
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  return (
    <section className="max-w-7x1 mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text[32px]">
          The Community Showcase
        </h1>
        <p className="mt-2 text-[#666e75] text-[16px]">
          Embark on a captivating journey in the realm of VonAi, where mere
          words blossom into exquisite visual masterpieces.
        </p>
      </div>
      <div className="mt-16">
        <FormFeild
          labelName="Search posts"
          type="text"
          name="text"
          placeholder="Search Posts"
          value={searchText}
          handleChange={handleSearchChange}
        />
      </div>
      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className="font-medium text-[#666e75] text-x1 mb-3">
                Showing Results for:{" "}
                <span className="text-[#222328] ">{searchText}</span>
              </h2>
            )}
            <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
              {searchText ? (
                <RenderCards data={searchedResults} title="No Search Results Found" />
              ) : (
                <RenderCards data={allPosts} title="No Posts Yet" />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Home