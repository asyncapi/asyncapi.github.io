import GenericLayout from '../components/layout/GenericLayout'
import roadmapData from '../roadmap.json'
import IconDocuments from '../components/icons/Documents'
import IconCode from '../components/icons/Code'
import IconPowerPlug from '../components/icons/PowerPlug'
import GeneratorInstallation from '../components/GeneratorInstallation'

export default function RoadmapPage() {
  const description = 'Long-term vision and plans for the AsyncAPI Initiative'
  const image = 'Image for meta tags here...'
  // const image = '/img/social/generator.png'

  return (
    <GenericLayout
      title="Vision & Roadmap"
      description={description}
      image={image}
      wide
    >
      <div className="py-16 overflow-hidden lg:py-24">
        <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-screen-xl">
          <div className="relative">
            <div className="lg:w-2/3 lg:mx-auto text-center">
              <p className="text-3xl font-bold text-gray-600 decoration-green-500 lg:text-4xl">
                AsyncAPI becomes the #1 API specification for defining and developing APIs. <span className="text-green-400 block">Any kind of APIs.</span>
              </p>
              <p className="mt-3 text-lg leading-7 text-gray-500 lg:pr-4">
                It all starts with a vision. This is where we want to see AsyncAPI by 2026.
              </p>
            </div>

            <div className="relative mt-20">
              <div className="grid lg:grid-cols-3 lg:gap-8">
                <div>
                  <h2 className="font-semibold mb-2 lg:my-0 lg:text-center lg:text-2xl">
                    <div className="uppercase inline-block bg-gray-100 text-green-400 text-xs p-1.5 mr-2 lg:block lg:bg-transparent lg:text-green-400 lg:text-sm lg:p-0 lg:mr-0 lg:mb-2">Goal</div>
                    AsyncAPI unifies all the API specifications
                  </h2>
                  <p className="my-4 text-gray-600 lg:text-center">
                    Nobody does only event-driven architectures. Most people complement them with REST (OpenAPI), GraphQL, and/or RPC APIs. <strong>We want people to use the AsyncAPI specification and tooling together with their existing OpenAPI, GraphQL, and gRPC definitions.</strong> For that purpose, our specification and tools will need to understand and leverage many other specifications and tools.
                  </p>
                  <p className="my-4 text-gray-600 lg:text-center">
                    This is not about reinventing the wheel or creating yet another spec to solve the same problems but to integrate with the existing tools instead.
                  </p>
                </div>
                <div>
                  <h2 className="font-semibold mt-6 mb-2 lg:my-0 lg:text-center lg:text-2xl">
                    <div className="uppercase inline-block bg-gray-100 text-green-400 text-xs p-1.5 mr-2 lg:block lg:bg-transparent lg:text-green-400 lg:text-sm lg:p-0 lg:mr-0 lg:mb-2">Goal</div>
                    API development experience is seamless
                  </h2>
                  <p className="my-4 text-gray-600 lg:text-center">
                    We want to make the development experience super seamless, from idea to production. <strong>Users should be able to create their first API within minutes without prior knowledge of AsyncAPI, the communication protocol, or anything else that's not business logic.</strong>
                  </p>
                  <p className="my-4 text-gray-600 lg:text-center">
                    Furthermore, making sure production behavior and documentation are always aligned, independently of the programming language or framework of choice.
                  </p>
                </div>
                <div>
                  <h2 className="font-semibold mt-6 mb-2 lg:my-0 lg:text-center lg:text-2xl">
                    <div className="uppercase inline-block bg-gray-100 text-green-400 text-xs p-1.5 mr-2 lg:block lg:bg-transparent lg:text-green-400 lg:text-sm lg:p-0 lg:mr-0 lg:mb-2">Goal</div>
                    The AsyncAPI community grows 400%
                  </h2>
                  <p className="my-4 text-gray-600 lg:text-center">
                    We are aware that our goals are insane. <strong>None of the other goals are possible if we don't have a huge community supporting us. AsyncAPI is and must continue being a community-driven initiative. Now more than ever.</strong>
                  </p>
                  <p className="my-4 text-gray-600 lg:text-center">
                    We need people to contribute code, ideas, docs, articles, presentations, and more. The sponsors base should also grow along with the community size and the donated money should serve to give back to the community.
                  </p>
                </div>
              </div>
            </div>

            <h3 className="text-center mt-10 text-3xl leading-8 font-normal tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
              Roadmap
            </h3>
            <p className="mt-4 max-w-3xl mx-auto text-center text-xl leading-7 text-gray-500">
              The key results we want to achieve
            </p>

            <div className="mt-10 lg:grid lg:grid-cols-3 lg:gap-10">
              <div>
                <div className="p-4">
                  <h3 className="text-md font-semibold uppercase text-center">Now</h3>
                  <p className="text-center text-sm text-gray-600 mt-2">Our top priority. We're probably working on it right now or starting pretty soon.</p>
                </div>
                <ul className="mt-3">
                  {
                    roadmapData.keyResults.now.map((kr, index) => (
                      <li key={index} className="mt-2 flex shadow-sm rounded-md">
                        <a href={kr.html_url} target="_blank" className="flex-shrink-0 flex items-center justify-center w-4 bg-green-300 text-sm font-medium rounded-l-md">
                          
                        </a>
                        <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md">
                          <div className="flex-1 px-4 py-2 text-sm">
                            <a href={kr.html_url} target="_blank" className="block text-gray-900 font-medium hover:text-gray-600">{kr.title}</a>
                          </div>
                        </div>
                      </li>
                    ))
                  }
                </ul>
              </div>
              <div>
                <div className="p-4">
                  <h3 className="text-md font-semibold uppercase text-center">Later</h3>
                  <p className="text-center text-sm text-gray-600 mt-2">Our next priority. We'll work on this soon if everything goes as planned.</p>
                </div>
                <ul className="mt-3">
                  {
                    roadmapData.keyResults.later.map((kr, index) => (
                      <li key={index} className="mt-2 flex shadow-sm rounded-md">
                        <a href={kr.html_url} target="_blank" className="flex-shrink-0 flex items-center justify-center w-4 bg-yellow-200 text-sm font-medium rounded-l-md">
                          
                        </a>
                        <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md">
                          <div className="flex-1 px-4 py-2 text-sm">
                            <a href={kr.html_url} target="_blank" className="block text-gray-900 font-medium hover:text-gray-600">{kr.title}</a>
                          </div>
                        </div>
                      </li>
                    ))
                  }
                </ul>
              </div>
              <div>
                <div className="p-4">
                  <h3 className="text-md font-semibold uppercase text-center">Future</h3>
                  <p className="text-center text-sm text-gray-600 mt-2">Not a priority. We're considering working on this but it's too early to know when.</p>
                </div>
                <ul className="mt-3">
                  {
                    roadmapData.keyResults.future.map((kr, index) => (
                      <li key={index} className="mt-2 flex shadow-sm rounded-md">
                        <a href={kr.html_url} target="_blank" className="flex-shrink-0 flex items-center justify-center w-4 bg-orange-200 text-sm font-medium rounded-l-md">
                          
                        </a>
                        <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md">
                          <div className="flex-1 px-4 py-2 text-sm">
                            <a href={kr.html_url} target="_blank" className="block text-gray-900 font-medium hover:text-gray-600">{kr.title}</a>
                          </div>
                        </div>
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GenericLayout>
  )
}
