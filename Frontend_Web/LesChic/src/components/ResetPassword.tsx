import { useSearchParams, useNavigate } from "react-router-dom"

export const ResetPassword = () => {

    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const token = searchParams.get('token')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        navigate('/')
    }

    return(
        <div>

        </div>
    )
}