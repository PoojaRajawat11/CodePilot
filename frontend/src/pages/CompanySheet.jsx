import { useParams, Link }
from "react-router-dom";

import { problems }
from "../data/problems";

function CompanySheet() {

  const { company } = useParams();

  const filteredProblems =
    problems.filter((p) =>
      p.companies?.includes(company)
    );

  return (

    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-5xl font-bold text-cyan-400 mb-10">

        {company} DSA Sheet

      </h1>
      <div className="space-y-5">

  {
    filteredProblems.map((problem) => (

      <Link
        key={problem.id}
        to={`/problems/${problem.id}`}
        className="block bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-cyan-400 transition"
      >

        <div className="flex justify-between items-center">

          <div>

            <h2 className="text-2xl font-bold">
              {problem.title}
            </h2>

            <p className="text-slate-400 mt-2">
              {problem.topic}
            </p>

          </div>

          <div className="flex gap-3">

            <span className={`
              px-4 py-2 rounded-full text-sm font-semibold

              ${
                problem.difficulty === "Easy"
                ? "bg-green-700"

                : problem.difficulty === "Medium"
                ? "bg-yellow-600"

                : "bg-red-700"
              }
            `}>

              {problem.difficulty}

            </span>

          </div>

        </div>

      </Link>
    ))
  }

</div>

      <div className="space-y-5">

        {
          filteredProblems.map((problem) => (

            <Link
              key={problem.id}
              to={`/problems/${problem.id}`}
              className="block bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-cyan-400"
            >

              <h2 className="text-2xl font-bold">
                {problem.title}
              </h2>

              <p className="text-slate-400 mt-2">
                {problem.topic}
              </p>

            </Link>
          ))
        }

      </div>

    </div>
  );
}

export default CompanySheet;