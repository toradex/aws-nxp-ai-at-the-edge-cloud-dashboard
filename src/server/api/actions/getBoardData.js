import getAllBoardDatas from 'root/src/server/api/actionUtils/getAllBoardDatas'
import getAllUserDatas from 'root/src/server/api/actionUtils/getAllUserDatas'

export default async () => {

	const allBoards = await getAllBoardDatas()
	const userDatas = await getAllUserDatas()
  return {
    allBoards,
    userDatas,
  }
}
