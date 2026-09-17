function TestCasePanel({ problem }) {

  if (!problem) return null;

  const tests = problem.visibleTests?.filter(Boolean) || [];

  return (
    <div className="p-4 bg-slate-900">

      <h2 className="text-xl font-bold text-cyan-400 mb-4">
        Visible Test Cases
      </h2>

      {tests.length === 0 ? (

        <p className="text-gray-400">
          No visible test cases available.
        </p>

      ) : (

        tests.map((test, index) => (

          <div
            key={index}
            className="bg-slate-800 p-4 rounded-xl mb-4"
          >

            <h3 className="font-semibold text-cyan-300 mb-2">
              Test Case {index + 1}
            </h3>

            <p className="mb-2">
              <strong>Input:</strong>
            </p>

            <pre className="bg-slate-950 p-2 rounded">
              {test?.input || "No Input"}
            </pre>

            <p className="mt-3 mb-2">
              <strong>Expected Output:</strong>
            </p>

            <pre className="bg-slate-950 p-2 rounded">
              {test?.output || "No Output"}
            </pre>

          </div>

        ))

      )}

    </div>
  );
}

export default TestCasePanel;