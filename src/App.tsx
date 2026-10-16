import { createBrowserRouter, Navigate, RouterProvider, useParams } from 'react-router-dom'
import { DemoProvider } from './state/DemoContext'
import Coverage from './pages/Coverage'
import BusinessDetails from './pages/BusinessDetails'
import Operations from './pages/Operations'
import AdditionalInfo from './pages/AdditionalInfo'
import CarrierQuestions from './pages/CarrierQuestions'
import Quotes from './pages/Quotes'

/** Remount per carrier so validation/submission state doesn't leak between carriers. */
function CarrierRoute() {
  const { carrierId } = useParams()
  return <CarrierQuestions key={carrierId} />
}

const router = createBrowserRouter(
  [
    { path: '/', element: <Navigate to="/apply/coverage" replace /> },
    { path: '/apply/coverage', element: <Coverage /> },
    { path: '/apply/business-details', element: <BusinessDetails /> },
    { path: '/apply/operations', element: <Operations /> },
    { path: '/apply/additional-info', element: <AdditionalInfo /> },
    { path: '/apply/carrier/:carrierId', element: <CarrierRoute /> },
    { path: '/quotes', element: <Navigate to="/quotes/chubb-gl" replace /> },
    { path: '/quotes/:quoteKey', element: <Quotes /> },
    { path: '*', element: <Navigate to="/apply/coverage" replace /> },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/' },
)

export default function App() {
  return (
    <DemoProvider>
      <RouterProvider router={router} />
    </DemoProvider>
  )
}
