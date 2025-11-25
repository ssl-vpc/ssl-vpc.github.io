window.onmessage = async (e) => {
	if (e.data && e.data.type && e.data.type === 'strawpoll_resize') {
		let embedWrapper = document.getElementById('strawpoll_'+e.data.id)
		embedWrapper.style.height = e.data.value + 'px'
	}
	if (e.data && e.data.type && e.data.type === 'strawpoll_scrolltop') {
                window.scrollTo(0, 0)
                console.log('scrolltop')
        }
	if (e.data && e.data.type && e.data.type === 'strawpoll_request_session_token') {
		let pollId = e.data.id

		let sessionToken = localStorage.getItem('strawpoll:session_token') 

		if (!sessionToken) {
			sessionToken = crypto.randomUUID()
			localStorage.setItem('strawpoll:session_token', sessionToken)
		}

		let iframe = document.getElementById('strawpoll_iframe_' + pollId)

		if (iframe) {
			iframe.contentWindow.postMessage({'type':'strawpoll_return_session_token','value':sessionToken}, '*')
		}
	}
}
